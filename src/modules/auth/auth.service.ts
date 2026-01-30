import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAuthDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const { email, password, confirm_password, full_name, avatar_url } =
      createAuthDto;

    if (password !== confirm_password) {
      throw new BadRequestException('Passwords do not match.');
    }

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

    const { password_hash: _password_hash, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect.');
    }

    const isPasswordMatches = await bcrypt.compare(
      password,
      user.password_hash,
    );
    if (!isPasswordMatches) {
      throw new UnauthorizedException('Email or password is incorrect.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRETKEY'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRETKEY'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES'),
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
