import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAuthDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const { email, password, full_name, avatar_url } = createAuthDto;

    const userExists = await this.prisma.users.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('Email already exists.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.prisma.users.create({
      data: {
        email,
        password_hash: hashedPassword,
        full_name,
        avatar_url,
      },
    });

    const payload = { sub: user.id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: 'AT_SECRET',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: 'RT_SECRET',
        expiresIn: '7d',
      }),
    ]);

    const { password_hash: _hash, ...userData } = user;

    return {
      user: userData,
      accessToken,
      refreshToken,
    };
  }
}
