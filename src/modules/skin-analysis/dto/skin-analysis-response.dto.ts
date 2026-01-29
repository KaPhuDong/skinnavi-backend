// src/modules/skin-analysis/dto/skin-analysis-response.dto.ts
export class SkinConcernDto {
  pores: number;
  acnes: number;
  darkCircles: number;
  darkSpots: number;
}

export class SkinRoutineStepDto {
  step: number;
  title: string;
  howTo: string;
  products: string[];
}

export class SkinRoutineSessionDto {
  reason: string;
  steps: SkinRoutineStepDto[];
}

export class SkinRoutineDto {
  morning: SkinRoutineSessionDto;
  evening: SkinRoutineSessionDto;
}

export class SkinAnalysisResponseDto {
  skinType: string;
  skinScore: number;
  concerns: SkinConcernDto;
  routine: SkinRoutineDto;
  note: string;
}
