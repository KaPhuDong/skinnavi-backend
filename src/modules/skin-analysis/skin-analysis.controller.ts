import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SkinAnalysisService } from './skin-analysis.service';
import { CreateSkinAnalysisDto } from './dto/create-skin-analysis.dto';
import { UpdateSkinAnalysisDto } from './dto/update-skin-analysis.dto';

@Controller('skin-analysis')
export class SkinAnalysisController {
  constructor(private readonly skinAnalysisService: SkinAnalysisService) {}

  @Post()
  create(@Body() createSkinAnalysisDto: CreateSkinAnalysisDto) {
    return this.skinAnalysisService.create(createSkinAnalysisDto);
  }

  @Get()
  findAll() {
    return this.skinAnalysisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skinAnalysisService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkinAnalysisDto: UpdateSkinAnalysisDto) {
    return this.skinAnalysisService.update(+id, updateSkinAnalysisDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skinAnalysisService.remove(+id);
  }
}
