import { Module } from '@nestjs/common';
import { SkinAnalysisService } from './skin-analysis.service';
import { SkinAnalysisController } from './skin-analysis.controller';

@Module({
  controllers: [SkinAnalysisController],
  providers: [SkinAnalysisService],
})
export class SkinAnalysisModule {}
