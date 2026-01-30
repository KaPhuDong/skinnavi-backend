import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { PageOptionsDto } from '../../common/dtos/page-options.dto';
import { SimpleResponse } from '../../common/dtos/index';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('affiliate')
  @ApiOperation({ summary: 'List affiliate products with pagination' })
  async getAffiliateProducts(@Query() pageOptionsDto: PageOptionsDto) {
    const result =
      await this.productsService.findAllAffiliateProducts(pageOptionsDto);
    return new SimpleResponse(
      result,
      'Listed affiliate products successfully',
      200,
    );
  }
}
