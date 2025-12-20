import { PartialType } from '@nestjs/mapped-types';
import { CreateSkinAnalysisDto } from './create-skin-analysis.dto';

export class UpdateSkinAnalysisDto extends PartialType(CreateSkinAnalysisDto) {}
