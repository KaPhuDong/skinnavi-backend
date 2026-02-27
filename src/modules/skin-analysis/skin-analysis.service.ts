import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, createUserContent } from '@google/genai';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, skin_metric_enum } from '@prisma/client';
import crypto from 'crypto';
import { AIAnalysisResult, analysisResultSchema } from './skin-analysis.schema';

const GEMINI_MODEL = 'gemini-2.5-flash';

@Injectable()
export class SkinAnalysisService {
  private ai: GoogleGenAI;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY is required');
    this.ai = new GoogleGenAI({ apiKey });
  }

  async analyzeImage(imageUrl: string, userId: string) {
    const imageBase64 = await this.fetchImageAsBase64(imageUrl);
    const mimeType = inferMimeType(imageUrl);

    const imageHash = crypto
      .createHash('sha256')
      .update(imageBase64)
      .digest('hex');

    const cached = await this.prisma.skin_analyses.findFirst({
      where: { image_hash: imageHash },
      include: { metrics: true, skin_type: true },
    });

    if (cached) {
      return this.mapAnalysisToResponse(cached);
    }

    const combos = await this.prisma.skincare_combos.findMany({
      where: { is_active: true },
      select: { id: true, combo_name: true, skin_type_id: true },
    });

    const comboListText = combos
      .map((c) => `- id: ${c.id}, name: ${c.combo_name}`)
      .join('\n');

    const prompt = buildAnalysisPrompt(comboListText, imageUrl);

    const aiRes = await this.callAIWithRetry({
      model: GEMINI_MODEL,
      contents: createUserContent([
        { inlineData: { mimeType, data: imageBase64 } },
        prompt,
      ]),
      config: {
        responseMimeType: 'application/json',
        temperature: 0,
        topP: 0.1,
        topK: 1,
      },
    });

    const text =
      aiRes.text ?? aiRes.candidates?.[0]?.content?.parts?.[0]?.text ?? null;

    if (!text) throw new BadRequestException('AI returned empty');

    const result = this.parseAIResponse(text);
    result.imageUrl = imageUrl;

    if (!result.isValidImage) {
      return { analysisId: null, result };
    }

    const skinType = await this.prisma.skin_types.findFirst({
      where: { code: result.skinType },
    });

    if (!skinType) throw new NotFoundException('Skin type not found');

    const last = await this.prisma.skin_analyses.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: { metrics: true },
    });

    let finalScore = result.overallScore;
    let finalMetrics = result.metrics;
    let finalSkinTypeId = skinType.id;

    if (last) {
      finalScore = this.smooth(last.overall_score, finalScore);

      finalMetrics = this.smoothMetrics(
        last.metrics,
        finalMetrics,
      ) as typeof finalMetrics;

      const scoreDiff = Math.abs(Number(last.overall_score) - finalScore);

      if (last.skin_type_id !== skinType.id && scoreDiff < 10) {
        finalSkinTypeId = last.skin_type_id;
      }
    }

    const recommendedCombos = combos
      .filter((c) => c.skin_type_id === finalSkinTypeId)
      .slice(0, 3)
      .map((c) => c.id);

    const analysis = await this.prisma.$transaction(async (tx) => {
      const created = await tx.skin_analyses.create({
        data: {
          user_id: userId,
          skin_type_id: finalSkinTypeId,
          overall_score: new Prisma.Decimal(finalScore),
          overall_comment: result.overallComment,
          face_image_url: imageUrl,
          image_hash: imageHash,
        },
      });

      await tx.skin_analysis_metrics.createMany({
        data: Object.entries(finalMetrics).map(([type, score]) => ({
          skin_analysis_id: created.id,
          metric_type: type as skin_metric_enum,
          score: new Prisma.Decimal(Number(score)),
        })),
      });

      return created;
    });

    return {
      analysisId: analysis.id,
      result: {
        ...result,
        overallScore: finalScore,
        metrics: finalMetrics,
        recommendedCombos,
      },
    };
  }

  private smooth(oldScore: Prisma.Decimal | null, newScore: number) {
    if (!oldScore) return newScore;
    return Number(oldScore) * 0.7 + newScore * 0.3;
  }

  private smoothMetrics(
    oldMetrics: any[],
    newMetrics: Record<string, number>,
  ): Record<string, number> {
    const map = Object.fromEntries(
      oldMetrics.map((m) => [m.metric_type, Number(m.score)]),
    );

    const result: Record<string, number> = {};

    for (const key in newMetrics) {
      const oldVal = map[key];
      const newVal = newMetrics[key];

      result[key] = oldVal ? oldVal * 0.7 + newVal * 0.3 : newVal;
    }

    return result;
  }

  private mapAnalysisToResponse(analysis: any) {
    const metrics = Object.fromEntries(
      analysis.metrics.map((m) => [m.metric_type, Number(m.score)]),
    );

    return {
      analysisId: analysis.id,
      result: {
        skinType: analysis.skin_type.code,
        overallScore: Number(analysis.overall_score),
        metrics,
        overallComment: analysis.overall_comment,
        recommendedCombos: [],
        isValidImage: true,
      },
    };
  }

  private async fetchImageAsBase64(imageUrl: string): Promise<string> {
    const res = await fetch(imageUrl);
    if (!res.ok) {
      throw new BadRequestException(`Cannot fetch image: ${res.status}`);
    }
    const buf = await res.arrayBuffer();
    return Buffer.from(buf).toString('base64');
  }

  private parseAIResponse(text: string): AIAnalysisResult {
    let json: unknown;

    try {
      json = JSON.parse(text);
    } catch {
      throw new BadRequestException('AI returned invalid JSON');
    }

    const result = analysisResultSchema.safeParse(json);

    if (!result.success) {
      throw new BadRequestException('AI response validation failed');
    }

    return result.data;
  }

  private async callAIWithRetry(payload: any, retries = 2) {
    for (let i = 0; i <= retries; i++) {
      try {
        return await this.ai.models.generateContent(payload);
      } catch (err) {
        if (i === retries) throw err;
      }
    }
    throw new Error('callAIWithRetry failed');
  }
}

export function buildAnalysisPrompt(
  comboListText: string,
  imageUrl: string,
): string {
  return `
You are a professional AI skin analysis system.

The input image URL is:
${imageUrl}

You MUST return this URL in the response as "imageUrl".

Your task has 2 phases:

====================
PHASE 1 — IMAGE VALIDATION
====================

Check if the image is suitable for skin analysis.

Reject the image if:
- Face is not centered or occupies less than 60% of the frame
- Blurry or low resolution
- Too dark or overexposed
- Strong shadows
- Wearing glasses or face is obstructed
- Multiple faces
- Not a real human face

If invalid → return ONLY:

{
  "isValidImage": false,
  "imageUrl": "${imageUrl}",
  "message": "short clear reason",
  "guidelines": [
    "Ensure face is centered and clearly visible.",
    "Find a well-lit area, avoid harsh shadows.",
    "Remove glasses or any accessories.",
    "Keep a neutral expression for analysis."
  ]
}

====================
PHASE 2 — SKIN ANALYSIS
====================

If the image is valid → return ONLY:

{
  "isValidImage": true,
  "imageUrl": "${imageUrl}",
  "skinType": "NORMAL | DRY | COMBINATION | SENSITIVE | OILY",
  "overallScore": number,
  "metrics": {
    "PORES": number,
    "ACNE": number,
    "DARK_CIRCLES": number,
    "DARK_SPOTS": number,
    "WRINKLES": number
  },
  "overallComment": string,
  "recommendedCombos": ["uuid1", "uuid2"]
  }

====================
SCORING RULES
====================

All scores MUST be INTEGER from 0 → 100.

100 = perfect healthy skin  
70-85 = normal real-life healthy skin  
50-69 = mild issues  
30-49 = moderate issues  
below 30 = severe  

If unsure → return score between 65-75.

DO NOT return decimal numbers.
DO NOT return values outside 0-100.
Do NOT guess invisible conditions.

====================
SKIN TYPE DETERMINATION (STRICT)
====================

Determine skinType FROM METRICS:

OILY → PORES < 60 AND overallScore < 75  
DRY → PORES > 70 AND overallScore < 70  
COMBINATION → mixed pore distribution  
SENSITIVE → redness / irritation dominates  
NORMAL → all metrics > 70  

DO NOT randomly choose skinType.

====================
COMBO SELECTION
====================

- Select 1-4 combos
- MUST return UUIDs from AVAILABLE COMBOS
- Prioritize matching skinType
- Focus on the most severe skin issues based on metrics
- If no perfect match exists → choose the closest suitable combos
- recommendedCombos MUST NOT be empty

AVAILABLE COMBOS:
${comboListText}

====================
STRICT RULES
====================

Return JSON only.
No extra text.
No null values.
`;
}

function inferMimeType(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes('png')) return 'image/png';
  if (lower.includes('webp')) return 'image/webp';
  return 'image/jpeg';
}
