import { ApiProperty } from '@nestjs/swagger';

export class SimpleResponse<T> {
  @ApiProperty({ example: 200, description: 'Code status HTTP' })
  readonly statusCode: number;

  @ApiProperty({
    description: 'Response data',
    nullable: true,
  })
  readonly data: T | null;

  @ApiProperty({
    example: 'Success',
    description: 'Response message',
  })
  readonly message: string;

  @ApiProperty({ example: true, description: 'Response success status' })
  readonly success: boolean;

  constructor(data: T, message: string = 'Success', statusCode: number = 200) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode >= 200 && statusCode < 300;
  }
}
