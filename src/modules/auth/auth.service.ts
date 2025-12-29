import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAuthDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(createAuthDto: CreateAuthDto) {
    const { email, password, full_name, gender, avatar_url } = createAuthDto;

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('Email already exists.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        full_name,
        gender,
        avatar_url,
      },
    });

    const { password_hash: _password_hash, ...result } = user;
    return result;
  }
}
