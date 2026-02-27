import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class GetRecommendationsDto {
  @ApiProperty({
    example: [
      'f9619dfd-abee-44b8-ba3f-2fea19bbfd84',
      '24367fe1-61cc-4618-844d-dfffa4cc5625',
    ],
    description: 'List of skincare combo IDs to retrieve recommendations for',
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  comboIds: string[];
}
