import { IsISO8601, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TrackingQueryDto {
  @ApiProperty({
    example: '2026-03-01',
    description: 'Start date in YYYY-MM-DD format',
    required: false,
  })
  @IsOptional()
  @IsISO8601({ strict: true })
  startDate?: string;

  @ApiProperty({
    example: '2026-03-31',
    description: 'End date in YYYY-MM-DD format',
    required: false,
  })
  @IsOptional()
  @IsISO8601({ strict: true })
  endDate?: string;
}
