import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { WordModule } from './word/word.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [ScheduleModule.forRoot(),PrismaModule,WordModule,AuthModule,GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
