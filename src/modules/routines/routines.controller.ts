import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RoutinesService } from './routines.service';
import { SimpleResponse } from '../../common/dtos/index';

@ApiTags('routines')
@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Get('packages')
  @ApiOperation({ summary: 'Get 3 routine packages for FE display' })
  async getPackages() {
    const result = await this.routinesService.getRoutinePackages();
    return new SimpleResponse(
      result,
      'Fetched routine packages successfully',
      200,
    );
  }
}
