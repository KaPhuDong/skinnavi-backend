// src/modules/skin-analysis/skin-analysis.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { uploadToCloudinary } from './utils/cloudinary';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface SkinAnalysisResult {
  skinType: 'OILY' | 'DRY' | 'COMBINATION' | 'SENSITIVE' | 'NORMAL';
  skinScore: number;
  concerns: {
    pores: number;
    acnes: number;
    darkCircles: number;
    darkSpots: number;
  };
  routine: {
    morning: {
      reason: string;
      steps: {
        step: number;
        title: string;
        howTo: string;
        products: string[];
      }[];
    };
    evening: {
      reason: string;
      steps: {
        step: number;
        title: string;
        howTo: string;
        products: string[];
      }[];
    };
  };
  note: string;
}

@Injectable()
export class SkinAnalysisService {
  private genAI: GoogleGenerativeAI;
  private readonly geminiModelCandidates: string[];

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY is missing in .env');

    this.genAI = new GoogleGenerativeAI(apiKey);

    const preferred = this.configService.get<string>('GEMINI_MODEL');

    this.geminiModelCandidates = [
      ...(preferred ? [preferred] : []),
      'gemini-2.5-flash',
    ];
  }

  async analyzeSkinFromImage(userId: string, file: Express.Multer.File) {
    try {
      await this.prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email: `${userId}@test.local`,
          password_hash: 'test_hash',
          full_name: 'Test User',
        },
      });

      const imageUrl = await uploadToCloudinary(file);

      const prompt = `
        You are an AI dermatology expert.
        Analyze the face image and return ONLY a valid JSON in English (no markdown, no explanation) with this exact format:

        {
          "skinType": "OILY|DRY|COMBINATION|SENSITIVE|NORMAL",
          "skinScore": number (0-100),
          "concerns": {
            "pores": number (0-100),
            "acnes": number (0-100),
            "darkCircles": number (0-100),
            "darkSpots": number (0-100)
          },
          "routine": {
            "morning": {
              "reason": string,
              "steps": [
                { "step": number, "title": string, "howTo": string, "products": string[] }
              ]
            },
            "evening": {
              "reason": string,
              "steps": [
                { "step": number, "title": string, "howTo": string, "products": string[] }
              ]
            }
          },
          "note": string
        }
        `;

      const imagePart = {
        inlineData: {
          data: file.buffer.toString('base64'),
          mimeType: file.mimetype,
        },
      };

      let text: string | null = null;

      for (const modelName of this.geminiModelCandidates) {
        try {
          const model = this.genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          });

          const result = await model.generateContent([
            prompt,
            imagePart as any,
          ]);
          text = result.response.text();
          break;
        } catch {
          console.warn(`Gemini model failed: ${modelName}`);
        }
      }

      if (!text) {
        throw new InternalServerErrorException('AI service unavailable');
      }

      const parsed = this.safeJsonParse(text);

      const record = await this.prisma.skinAnalysis.create({
        data: {
          user_id: userId,
          image_url: imageUrl,
          result_skin_type: parsed.skinType,
          ad_results: parsed.routine,
          consultation_note: parsed.note,
          skin_score: parsed.skinScore,
          concerns: parsed.concerns,
        },
      });

      return record;
    } catch (error) {
      console.error('Skin analysis failed:', error);
      throw new InternalServerErrorException('Skin analysis failed');
    }
  }

  private safeJsonParse(text: string): SkinAnalysisResult {
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?/i, '')
      .replace(/```$/, '')
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start >= 0 && end > start) {
        return JSON.parse(cleaned.slice(start, end + 1));
      }
      throw new Error('Invalid JSON from AI');
    }
  }
}
