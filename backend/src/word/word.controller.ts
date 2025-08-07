import {
  Controller,
  Body,
  Get,
  Post,
  BadRequestException,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { WordService } from './word.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Controller('word')
export class WordController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wordService: WordService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('today')
  async getWordOfTheDay() {
    const todayStart = new Date(new Date().toDateString());

    const word = await this.prisma.word.findFirst({
      where: { date: todayStart },
    });

    if (!word) {
      throw new NotFoundException('Mot du jour non défini.');
    }

    return {
      length: word.value.length,
      firstLetter: word.value.charAt(0).toUpperCase(),
      date: word.date.toISOString().split('T')[0],
    };
  }

  @Post('validate')
  async validateGuess(
    @Req() req,
    @Body() body: { guess: string; anonId?: string },
  ) {
    const guess = body.guess?.toLowerCase();
    const anonId: string | undefined = body.anonId;

    // 🔐 Décodage manuel du JWT
    let userId: string | undefined = undefined;
    const authHeader = req.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = await this.jwtService.verifyAsync(token);
        userId = payload.sub;
        console.log('🔐 JWT détecté, userId =', userId);
      } catch (err) {
        console.warn('⚠️ Token JWT invalide ou expiré');
      }
    }

    console.log('🔍 Requête /validate reçue');
    console.log('➡️ guess:', guess);
    console.log('👤 userId:', userId);
    console.log('👻 anonId:', anonId);

    if (!guess || typeof guess !== 'string') {
      throw new BadRequestException('Le mot proposé est invalide.');
    }

    const todayStart = new Date(new Date().toDateString());
    const word = await this.prisma.word.findFirst({ where: { date: todayStart } });

    if (!word) {
      console.log('❌ Aucun mot du jour trouvé pour', todayStart);
      throw new BadRequestException('Mot du jour non défini.');
    }

    console.log('📘 Mot du jour trouvé:', word.value, '| ID:', word.id);

    const target = word.value.toLowerCase();

    if (guess.length !== target.length) {
      throw new BadRequestException(`Le mot doit faire ${target.length} lettres.`);
    }
    
    if (!this.wordService.wordExists(guess)) {
      console.log(`❌ Le mot "${guess}" n'existe pas dans le dictionnaire.`);
      throw new BadRequestException('Ce mot n’existe pas dans le dictionnaire.');
    }

    let game;
    let existingAttempts: string[] = [];

    if (userId || anonId) {
      const gameWhere: any = { wordId: word.id };
      if (userId) gameWhere.userId = userId;
      if (anonId) gameWhere.anonId = anonId;

      game = await this.prisma.game.findFirst({ where: gameWhere });
      existingAttempts = game?.attempts ?? [];

      console.log('🎮 Partie existante :', game ? 'Oui' : 'Non');
      console.log('📜 Tentatives existantes :', existingAttempts);

      if (existingAttempts.length >= 6) {
        throw new BadRequestException('Nombre maximum de tentatives atteint.');
      }
    }

    // Calcul des couleurs
    const colors = Array(target.length).fill('blue');
    const targetUsed = Array(target.length).fill(false);
    const guessUsed = Array(target.length).fill(false);

    for (let i = 0; i < target.length; i++) {
      if (guess[i] === target[i]) {
        colors[i] = 'red';
        targetUsed[i] = true;
        guessUsed[i] = true;
      }
    }

    for (let i = 0; i < target.length; i++) {
      if (colors[i] === 'blue') {
        for (let j = 0; j < target.length; j++) {
          if (!targetUsed[j] && !guessUsed[i] && guess[i] === target[j]) {
            colors[i] = 'yellow';
            targetUsed[j] = true;
            guessUsed[i] = true;
            break;
          }
        }
      }
    }

    const newAttempts = [...existingAttempts, guess];
    const status = guess === target ? 'Win' : newAttempts.length >= 6 ? 'Lose' : 'Pending';

    console.log('🧠 Résultat tentative :', { colors, status, newAttempts });

    if (userId || anonId) {
      if (game) {
        console.log('✏️ Mise à jour de la partie...');
        await this.prisma.game.update({
          where: { id: game.id },
          data: { attempts: newAttempts, status },
        });
        console.log('✅ Partie mise à jour avec succès.');
      } else {
        console.log('🆕 Création d\'une nouvelle partie...');
        try {
          await this.prisma.game.create({
            data: {
              userId: userId ?? null,
              anonId: anonId ?? null,
              wordId: word.id,
              date: todayStart,
              attempts: [guess],
              status,
            } as Prisma.GameUncheckedCreateInput,
          });
          console.log('✅ Partie créée avec succès.');
        } catch (err) {
          console.error('💥 Erreur lors de la création du game :', err);
          throw new BadRequestException('Erreur lors de la sauvegarde du game');
        }
      }
    } else {
      console.log('⚠️ Ni userId ni anonId fourni — partie non sauvegardée');
    }

    return {
      colors,
      status,
      remainingAttempts: 6 - newAttempts.length,
    };
  }

  @Post('init')
  async manualInit(@Req() req) {
    const secret = req.headers['x-init-secret'];
    if (secret !== process.env.INIT_SECRET) {
      throw new UnauthorizedException('Clé secrète invalide.');
    }
  
    await this.wordService.selectDailyWord();
    return { status: 'Mot inséré manuellement' };
  }
}
