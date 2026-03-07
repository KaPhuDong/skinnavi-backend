import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RoutinesService } from './routines.service';
import { RoutinesController } from './routines.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ApiKeyManagerModule } from 'src/common/aipKeyManager/api-key-manager.module';

@Module({
  imports: [PrismaModule, ApiKeyManagerModule, ScheduleModule.forRoot()],
  controllers: [RoutinesController],
  providers: [RoutinesService],
})
export class RoutinesModule {}
