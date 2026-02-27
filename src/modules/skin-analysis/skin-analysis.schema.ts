import { z } from 'zod';

export const metricSchema = z.object({
  PORES: z.number().int().min(0).max(100),
  ACNE: z.number().int().min(0).max(100),
  DARK_CIRCLES: z.number().int().min(0).max(100),
  DARK_SPOTS: z.number().int().min(0).max(100),
  WRINKLES: z.number().int().min(0).max(100),
});

export const validAnalysisSchema = z.object({
  isValidImage: z.literal(true),
  imageUrl: z.string().url(),
  skinType: z.enum(['NORMAL', 'DRY', 'COMBINATION', 'SENSITIVE', 'OILY']),
  overallScore: z.number().int().min(0).max(100),
  metrics: metricSchema,
  overallComment: z.string(),
  recommendedCombos: z.array(z.string().uuid()).max(3),
});

export const invalidAnalysisSchema = z.object({
  isValidImage: z.literal(false),
  imageUrl: z.string().url(),
  message: z.string(),
  guidelines: z.array(z.string()),
});

export const analysisResultSchema = z.union([
  validAnalysisSchema,
  invalidAnalysisSchema,
]);

export type AIAnalysisResult = z.infer<typeof analysisResultSchema>;
