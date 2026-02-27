import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SimpleResponse } from '../../common/dtos/index';
import { GetRecommendationsDto } from '../combos/dto/get-recommendations.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CombosService } from './combos.service';

@ApiTags('combos')
@Controller('combos')
export class CombosController {
  constructor(private readonly combosService: CombosService) {}

  @Post('recommendations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get detailed information for recommended skincare combos',
  })
  async getRecommendedCombos(@Body() dto: GetRecommendationsDto) {
    const combos = await this.combosService.findRecommendedCombos(dto.comboIds);
    return new SimpleResponse(
      combos,
      'Listed recommended skincare combos successfully',
      200,
    );
  }

  @Post('products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a flat list of products from specific skincare combos',
  })
  async getProductsInCombos(@Body() dto: GetRecommendationsDto) {
    const products = await this.combosService.findProductsInCombos(
      dto.comboIds,
    );
    return new SimpleResponse(
      products,
      'Listed products from combos successfully',
      200,
    );
  }
}
