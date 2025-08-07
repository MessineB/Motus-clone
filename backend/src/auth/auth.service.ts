import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) { }

  async register(name: string, email: string, password: string) {

    const nameExists = await this.prisma.user.findUnique({ where: { name } });
    if (nameExists) throw new BadRequestException('Pseudo déjà utilisé.');

    const hashed = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { name, email, password: hashed },
    });

    return { message: 'Compte créé avec succès' };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (!user) throw new BadRequestException('Email ou mot de passe incorrect');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new BadRequestException('Email ou mot de passe incorrect');

    const token = await this.jwt.signAsync({ sub: user.id });

    return { token };
  }
}
