import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SaveGameDto } from './dto/save-game.dto';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async saveGame(dto: SaveGameDto, userId?: string) {
    return this.prisma.game.create({
      data: {
        wordId: dto.wordId,
        attempts: dto.attempts,
        status: dto.status,
        date: new Date(),
        userId: userId || null,
        anonId: dto.anonId || null,
      },
    });
  }
}
