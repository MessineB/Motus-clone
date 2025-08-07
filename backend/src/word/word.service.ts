import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WordService {
  private readonly logger = new Logger(WordService.name);

  private dailyWords: string[] = []; // ← mots du jour possibles (words.json)
  private wordSet: Set<string> = new Set(); // ← dictionnaire complet (wordtest.json)

  constructor(private readonly prisma: PrismaService) {
    this.loadFiles();
  }

  private loadFiles() {
    // Chargement du fichier des mots du jour possibles
    const dailyWordsPath = path.resolve('src/word/words.json');
    const dailyData = fs.readFileSync(dailyWordsPath, 'utf-8');
    this.dailyWords = JSON.parse(dailyData);
    this.logger.log(`📅 ${this.dailyWords.length} mots chargés depuis words.json`);

    // Chargement du dictionnaire complet
    const dictPath = path.resolve('src/word/wordtest.json');
    const dictData = fs.readFileSync(dictPath, 'utf-8');
    const allWords: string[] = JSON.parse(dictData);
    this.wordSet = new Set(allWords.map(word => word.toLowerCase()));
    this.logger.log(`📖 ${this.wordSet.size} mots chargés depuis wordtest.json`);
  }

  // ✅ Vérification d’un mot
  public wordExists(word: string): boolean {
    return this.wordSet.has(word.toLowerCase());
  }

  // ✅ Tirage du mot du jour depuis dailyWords[]
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async selectDailyWord() {
    const today = new Date();
    const todayStart = new Date(today.toDateString());

    const existing = await this.prisma.word.findFirst({ where: { date: todayStart } });
    if (existing) {
      this.logger.log('Mot du jour déjà défini.');
      return;
    }

    const allUsedWords = await this.prisma.word.findMany({
      select: { value: true },
    });

    const used = new Set(allUsedWords.map(w => w.value));
    const candidates = this.dailyWords.filter(word => !used.has(word));

    if (candidates.length === 0) {
      this.logger.warn('Aucun mot disponible !');
      return;
    }

    const selected = candidates[Math.floor(Math.random() * candidates.length)];

    await this.prisma.word.create({
      data: {
        value: selected,
        date: todayStart,
      },
    });

    this.logger.log(`🆕 Mot du jour sélectionné : ${selected}`);
  }
}
