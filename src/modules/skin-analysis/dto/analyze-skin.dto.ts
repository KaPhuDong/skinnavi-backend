// src/modules/skin-analysis/dto/analyze-skin.dto.ts
import { IsString } from 'class-validator';

export class AnalyzeSkinDto {
  @IsString()
  userId: string;
}
