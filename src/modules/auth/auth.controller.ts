import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
  getSchemaPath,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateAuthDto, LoginDto } from './dto/index';
import { SimpleResponse } from '../../common/dtos/index';
import { AuthGuard } from '@nestjs/passport';

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
    return new SimpleResponse(result, 'Registered successfully.', 201);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login to the system' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      allOf: [
        { $ref: getSchemaPath(SimpleResponse) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    full_name: { type: 'string' },
                    role: { type: 'string' },
                  },
                },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          },
        },
      ],
    },
  })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return new SimpleResponse(
      { accessToken: result.accessToken },
      'Login successful.',
      200,
    );
  }

  @Post('logout')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Req() req) {
    await this.authService.logout(req.user['id']);
    return new SimpleResponse(null, 'Logged out successfully.', 200);
  }

  @Post('refresh')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh tokens' })
  async refreshTokens(@Req() req) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    return new SimpleResponse(tokens, 'Tokens refreshed successfully.', 200);
  }
}
