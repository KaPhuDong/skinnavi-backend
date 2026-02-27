import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RoutinePackagesService {
  constructor(private prisma: PrismaService) {}

  async getRoutinePackages() {
    return this.prisma.routine_packages.findMany();
  }

  async getRoutinePackageById(id: string) {
    return this.prisma.routine_packages.findUnique({
      where: { id },
    });
  }
}
