import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { SimpleResponse } from '../../common/dtos';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('routines')
@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post()
  async create(@Body() dto: CreateRoutineDto) {
    const data = await this.routinesService.createRoutine(dto);
    return new SimpleResponse(data, 'Routine created successfully', 201);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get(':userId')
  async getByUser(@Param('userId') userId: string) {
    const data = await this.routinesService.getRoutineByUser(userId);
    return new SimpleResponse(data, 'Get routine by user', 200);
  }
}
