import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateAuthDto } from './dto/index';
import { SimpleResponse } from '../../common/dtos/index';

@ApiTags('auth')
@ApiExtraModels(SimpleResponse)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      allOf: [
        { $ref: getSchemaPath(SimpleResponse) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                email: { type: 'string' },
                full_name: { type: 'string' },
                avatar_url: { type: 'string' },
                role: { type: 'string', example: 'USER' },
                created_at: { type: 'string', format: 'date-time' },
              },
            },
            message: { type: 'string', example: 'Registered successfully.' },
          },
        },
      ],
    },
  })
  async register(@Body() createAuthDto: CreateAuthDto) {
    const result = await this.authService.register(createAuthDto);
    return new SimpleResponse(result, 'Registered successfully.');
  }
}
