import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RoutinePackagesService } from './routine-packages.service';
import { SimpleResponse } from '../../common/dtos/index';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('routine-packages')
@Controller('routine-packages')
export class RoutinePackagesController {
  constructor(
    private readonly routinePackagesService: RoutinePackagesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('all')
  @ApiOperation({ summary: 'Get 3 routine packages for FE display' })
  async getPackages() {
    const result = await this.routinePackagesService.getRoutinePackages();
    return new SimpleResponse(
      result,
      'Fetched routine packages successfully',
      200,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('package/:id')
  @ApiOperation({ summary: 'Get routine package by ID' })
  async getPackageById(@Param('id') id: string) {
    const result = await this.routinePackagesService.getRoutinePackageById(id);
    return new SimpleResponse(
      result,
      'Fetched routine package successfully',
      200,
    );
  }
}
