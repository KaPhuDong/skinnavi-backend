import { Module } from '@nestjs/common';
import { RoutinePackagesService } from './routine-packages.service';
import { RoutinePackagesController } from './routine-packages.controller';

@Module({
  controllers: [RoutinePackagesController],
  providers: [RoutinePackagesService],
})
export class RoutinePackagesModule {}
