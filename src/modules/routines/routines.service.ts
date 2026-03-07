import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { ApiKeyManagerService } from 'src/common/aipKeyManager/api-key-manager.service';

const GEMINI_MODEL = 'gemini-2.5-flash';

@Injectable()
export class RoutinesService implements OnModuleInit {
  private ai: GoogleGenAI;
  private readonly logger = new Logger(RoutinesService.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private apiKeyManager: ApiKeyManagerService,
  ) {
    const apiKey = this.apiKeyManager.getCurrentKey();
    this.ai = new GoogleGenAI({ apiKey });
  }

  async onModuleInit() {
    // Create daily logs for today when server starts
    try {
      this.logger.log('Checking and creating daily logs for today...');
      await this.createDailyLogsForToday();
      this.logger.log('Daily logs check completed');
    } catch (error) {
      this.logger.error('Failed to create daily logs on startup:', error);
    }
  }

  // Create and check daily logs for all active routines (manual trigger)
  async createAndCheckDailyLogs(): Promise<{
    created: number;
    checked: number;
    logs: any[];
  }> {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Find all active routines where subscription is still valid
    const activeRoutines = await this.prisma.user_routines.findMany({
      where: {
        subscription: {
          start_date: { lte: todayEnd },
          end_date: { gte: today },
        },
      },
      include: {
        subscription: true,
      },
    });

    let totalCreated = 0;
    let totalChecked = 0;
    const allLogs: any[] = [];

    for (const routine of activeRoutines) {
      try {
        // Calculate the date range for this routine
        const routineStartDate = new Date(routine.created_at);
        routineStartDate.setHours(0, 0, 0, 0);

        const subscriptionEndDate = new Date(routine.subscription.end_date);
        subscriptionEndDate.setHours(23, 59, 59, 999);

        // Use the later date between routine creation and subscription start
        const startDate =
          routineStartDate > new Date(routine.subscription.start_date)
            ? routineStartDate
            : new Date(routine.subscription.start_date);

        // Use the earlier date between today and subscription end
        const endDate =
          today < subscriptionEndDate ? today : subscriptionEndDate;

        // Create logs for each day from start to end
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const logDate = new Date(currentDate);

          const existingLog = await this.prisma.routine_daily_logs.findFirst({
            where: {
              user_routine_id: routine.id,
              log_date: logDate,
            },
          });

          totalChecked++;

          if (!existingLog) {
            const newLog = await this.prisma.routine_daily_logs.create({
              data: {
                user_routine_id: routine.id,
                log_date: logDate,
                is_completed: false,
              },
            });
            allLogs.push(newLog);
            totalCreated++;
          }

          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } catch (error) {
        this.logger.error(
          `Failed to create logs for routine ${routine.id}:`,
          error,
        );
      }
    }

    this.logger.log(
      `Checked ${totalChecked} logs, created ${totalCreated} new logs`,
    );
    return { created: totalCreated, checked: totalChecked, logs: allLogs };
  }

  // Create daily logs only for today (used on server startup)
  private async createDailyLogsForToday() {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Find all active routines where subscription is still valid
    const activeRoutines = await this.prisma.user_routines.findMany({
      where: {
        subscription: {
          start_date: { lte: todayEnd },
          end_date: { gte: today },
        },
      },
    });

    // Create daily logs for today only if not already created
    const results: any[] = [];
    for (const routine of activeRoutines) {
      try {
        const existingLog = await this.prisma.routine_daily_logs.findFirst({
          where: {
            user_routine_id: routine.id,
            log_date: today,
          },
        });

        if (!existingLog) {
          const newLog = await this.prisma.routine_daily_logs.create({
            data: {
              user_routine_id: routine.id,
              log_date: today,
              is_completed: false,
            },
          });
          results.push(newLog);
        }
      } catch (error) {
        this.logger.error(
          `Failed to create today's log for routine ${routine.id}:`,
          error,
        );
      }
    }

    if (results.length > 0) {
      this.logger.log(`Created ${results.length} daily logs for today`);
    }
    return { created: results.length, logs: results };
  }

  private async generateContentWithRetry(
    modelName: string,
    contentParams: any,
  ) {
    let attempts = 0;
    while (attempts < this.apiKeyManager.totalKeys) {
      const apiKey = this.apiKeyManager.getCurrentKey();

      const ai = new GoogleGenAI({
        apiKey: apiKey,
      });

      try {
        return await ai.models.generateContent({
          model: modelName,
          contents: contentParams,
        });
      } catch (error: any) {
        if (
          error?.status === 429 ||
          error?.message?.includes('429') ||
          error?.message?.toLowerCase().includes('quota')
        ) {
          this.apiKeyManager.getNextKey();
          attempts++;
        } else {
          throw error;
        }
      }
    }
    throw new BadRequestException('All API keys exhausted');
  }

  async createRoutine(params: {
    userId: string;
    skinAnalysisId: string;
    routinePackageId: string;
    comboId: string;
  }) {
    const { userId, skinAnalysisId, routinePackageId, comboId } = params;

    const analysis = await this.prisma.skin_analyses.findFirst({
      where: { id: skinAnalysisId, user_id: userId },
      include: { metrics: true, skin_type: true },
    });
    if (!analysis) throw new NotFoundException('Skin analysis not found');

    const pkg = await this.prisma.routine_packages.findUnique({
      where: { id: routinePackageId },
    });
    if (!pkg) throw new NotFoundException('Package not found');

    const combo = await this.prisma.skincare_combos.findUnique({
      where: { id: comboId },
      include: {
        combo_products: { include: { product: true } },
      },
    });
    if (!combo || !combo.combo_products.length) {
      throw new BadRequestException('Combo has no products');
    }

    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + pkg.duration_days);

    const subscription = await this.prisma.user_package_subscriptions.create({
      data: {
        user_id: userId,
        routine_package_id: routinePackageId,
        selected_combo_id: comboId,
        start_date: start,
        end_date: end,
      },
    });

    const metricsText = analysis.metrics
      .map((m) => `${m.metric_type}: ${m.score}`)
      .join(', ');

    const comboProductsText = combo.combo_products
      .map(
        (cp) =>
          `- ${cp.product.name} (id: ${cp.product.id}, role: ${cp.product.usage_role ?? 'N/A'})`,
      )
      .join('\n');

    const prompt = `
    You are an AI skincare routine expert.
    Based on this data, generate a DAILY skincare routine.
  
    Skin type: ${analysis.skin_type.code}
    Metrics: ${metricsText}
  
    Selected combo products:
    ${comboProductsText}
  
    Return ONLY valid JSON:
  
    {
      "morning": {
        "steps": [
          { "step": number, "title": string, "howTo": string, "productId": "uuid" }
        ]
      },
      "evening": {
        "steps": [
          { "step": number, "title": string, "howTo": string, "productId": "uuid" }
        ]
      }
    }
  
    Rules:
    - Use ONLY productId from the list above.
    - step must be number.
    - No markdown, no explanation.
    `;

    const res = await this.generateContentWithRetry(GEMINI_MODEL, [
      { role: 'user', parts: [{ text: prompt }] },
    ]);

    const raw =
      (res as any).text ?? res.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new BadRequestException('AI did not return JSON');

    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new BadRequestException('AI returned invalid JSON');
    }

    const validProductIds = combo.combo_products.map((cp) => cp.product.id);

    const saveRoutine = async (time: 'MORNING' | 'EVENING', steps: any[]) => {
      const routine = await this.prisma.user_routines.create({
        data: {
          user_package_subscription_id: subscription.id,
          routine_time: time,
        },
      });

      for (const step of steps) {
        if (!validProductIds.includes(step.productId)) {
          throw new BadRequestException(`Invalid productId: ${step.productId}`);
        }

        const productInfo = combo.combo_products.find(
          (cp) => cp.product.id === step.productId,
        )?.product;

        const createdStep = await this.prisma.user_routine_steps.create({
          data: {
            user_routine_id: routine.id,
            step_order: step.step,
            instruction: `${step.title}: ${step.howTo}`,
            product_id: step.productId,
          },
        });

        if (productInfo?.usage_role) {
          const instructionTemplate =
            await this.prisma.product_usage_instructions.findUnique({
              where: { usage_role: productInfo.usage_role },
              include: { sub_steps: { orderBy: { step_order: 'asc' } } },
            });

          if (instructionTemplate && instructionTemplate.sub_steps.length > 0) {
            const subStepsData = instructionTemplate.sub_steps.map((ss) => ({
              user_routine_step_id: createdStep.id,
              title: ss.title,
              how_to: ss.how_to,
              image_url: ss.image_url,
            }));

            await this.prisma.user_routine_sub_steps.createMany({
              data: subStepsData,
            });
          }
        }
      }
      return routine.id;
    };

    const morningRoutineId = await saveRoutine('MORNING', parsed.morning.steps);
    const eveningRoutineId = await saveRoutine('EVENING', parsed.evening.steps);

    return {
      subscriptionId: subscription.id,
      morningRoutineId,
      eveningRoutineId,
    };
  }

  async getAllRoutinesByUser(userId: string) {
    return this.prisma.user_routines.findMany({
      where: {
        subscription: { user_id: userId },
      },
      include: {
        steps: {
          include: { product: true, sub_steps: true },
          orderBy: { step_order: 'asc' },
        },
        subscription: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getLatestRoutineByUser(userId: string) {
    const [morning, evening] = await Promise.all([
      this.prisma.user_routines.findFirst({
        where: {
          subscription: { user_id: userId },
          routine_time: 'MORNING',
        },
        include: {
          steps: {
            include: { product: true, sub_steps: true },
            orderBy: { step_order: 'asc' },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.user_routines.findFirst({
        where: {
          subscription: { user_id: userId },
          routine_time: 'EVENING',
        },
        include: {
          steps: {
            include: { product: true, sub_steps: true },
            orderBy: { step_order: 'asc' },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
    ]);

    return { morning, evening };
  }

  async getRoutinePackages() {
    return this.prisma.routine_packages.findMany();
  }

  async getStepDetail(stepId: string) {
    const step = await this.prisma.user_routine_steps.findUnique({
      where: { id: stepId },
      include: { product: true, sub_steps: true },
    });
    if (!step) {
      throw new NotFoundException('Routine step not found');
    }
    return step;
  }

  // Create daily logs for all missing days (runs every day at midnight)
  // This creates logs for ALL days from routine creation to today
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async createDailyLogs() {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Find all active routines where subscription is still valid
    const activeRoutines = await this.prisma.user_routines.findMany({
      where: {
        subscription: {
          start_date: { lte: todayEnd },
          end_date: { gte: today },
        },
      },
      include: {
        subscription: true,
      },
    });

    // Create daily logs for each active routine if not already created
    const results: any[] = [];
    for (const routine of activeRoutines) {
      try {
        // Calculate the date range for this routine
        const routineStartDate = new Date(routine.created_at);
        routineStartDate.setHours(0, 0, 0, 0);

        const subscriptionEndDate = new Date(routine.subscription.end_date);
        subscriptionEndDate.setHours(23, 59, 59, 999);

        // Use the later date between routine creation and subscription start
        const startDate =
          routineStartDate > new Date(routine.subscription.start_date)
            ? routineStartDate
            : new Date(routine.subscription.start_date);

        // Use the earlier date between today and subscription end
        const endDate =
          today < subscriptionEndDate ? today : subscriptionEndDate;

        // Create logs for each day from start to end
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const logDate = new Date(currentDate);

          const existingLog = await this.prisma.routine_daily_logs.findFirst({
            where: {
              user_routine_id: routine.id,
              log_date: logDate,
            },
          });

          if (!existingLog) {
            const newLog = await this.prisma.routine_daily_logs.create({
              data: {
                user_routine_id: routine.id,
                log_date: logDate,
                is_completed: false,
              },
            });
            results.push(newLog);
          }

          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } catch (error) {
        this.logger.error(
          `Failed to create logs for routine ${routine.id}:`,
          error,
        );
      }
    }

    return { created: results.length, logs: results };
  }

  // Update daily log completion status
  async updateDailyLog(logId: string, is_completed: boolean) {
    const log = await this.prisma.routine_daily_logs.findUnique({
      where: { id: logId },
    });

    if (!log) {
      throw new NotFoundException('Daily log not found');
    }

    return this.prisma.routine_daily_logs.update({
      where: { id: logId },
      data: { is_completed },
    });
  }

  // Get tracking overview with date range filter
  async getTrackingOverview(
    userId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Parse dates with fallback to full range if not provided
    let start: Date | null = null;
    let end: Date | null = null;

    if (startDate) {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
    }

    if (endDate) {
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    }

    // Get all skin analyses with metrics (for trend analysis)
    const skinAnalyses = await this.prisma.skin_analyses.findMany({
      where: { user_id: userId },
      include: {
        skin_type: true,
        metrics: true,
      },
      orderBy: { created_at: 'desc' },
    });

    // Build skin analyses with trend calculation
    const analyzesWithTrend: any[] = [];
    for (let i = 0; i < skinAnalyses.length; i++) {
      const current = skinAnalyses[i];
      const previous = skinAnalyses[i + 1];

      let scoreTrend: number | null = null;
      if (current.overall_score && previous?.overall_score) {
        scoreTrend =
          Number(current.overall_score) - Number(previous.overall_score);
      }

      analyzesWithTrend.push({
        id: current.id,
        skin_type_code: current.skin_type.code,
        overall_score: current.overall_score
          ? Number(current.overall_score)
          : null,
        overall_comment: current.overall_comment,
        created_at: current.created_at.toISOString(),
        face_image_url: current.face_image_url,
        overall_score_trend: scoreTrend,
        metrics: current.metrics.map((m) => ({
          metric_type: m.metric_type,
          score: m.score ? Number(m.score) : null,
        })),
      });
    }

    // Get all routines with daily logs (filter logs by date range)
    const subscriptions = await this.prisma.user_package_subscriptions.findMany(
      {
        where: { user_id: userId },
        include: {
          routines: {
            include: {
              daily_logs: {
                where:
                  start && end ? { log_date: { gte: start, lte: end } } : {},
                orderBy: { log_date: 'asc' },
              },
            },
            orderBy: { routine_time: 'asc' },
          },
        },
      },
    );

    // Build routines array (separated from skin analyses)
    const routines: any[] = [];

    for (const subscription of subscriptions) {
      for (const routine of subscription.routines) {
        const completedCount = routine.daily_logs.filter(
          (log) => log.is_completed,
        ).length;

        routines.push({
          routine_id: routine.id,
          routine_time: routine.routine_time,
          routine_created_at: routine.created_at.toISOString(),
          subscription_id: subscription.id,
          subscription_start_date: subscription.start_date
            .toISOString()
            .split('T')[0],
          subscription_end_date: subscription.end_date
            .toISOString()
            .split('T')[0],
          daily_logs: routine.daily_logs.map((log) => ({
            id: log.id,
            user_routine_id: log.user_routine_id,
            log_date: log.log_date.toISOString().split('T')[0],
            is_completed: log.is_completed,
          })),
          completed_count: completedCount,
          total_count: routine.daily_logs.length,
        });
      }
    }

    return {
      user_id: user.id,
      full_name: user.full_name,
      email: user.email,
      avatar_url: user.avatar_url,
      skin_analyses: analyzesWithTrend,
      routines,
    };
  }
}
