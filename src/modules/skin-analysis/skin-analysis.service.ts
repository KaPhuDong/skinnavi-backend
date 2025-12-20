import { Injectable } from '@nestjs/common';
import { CreateSkinAnalysisDto } from './dto/create-skin-analysis.dto';
import { UpdateSkinAnalysisDto } from './dto/update-skin-analysis.dto';

@Injectable()
export class SkinAnalysisService {
  create(createSkinAnalysisDto: CreateSkinAnalysisDto) {
    return 'This action adds a new skinAnalysis';
  }

  findAll() {
    return `This action returns all skinAnalysis`;
  }

  findOne(id: number) {
    return `This action returns a #${id} skinAnalysis`;
  }

  update(id: number, updateSkinAnalysisDto: UpdateSkinAnalysisDto) {
    return `This action updates a #${id} skinAnalysis`;
  }

  remove(id: number) {
    return `This action removes a #${id} skinAnalysis`;
  }
}
