import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [AuthModule], 
  controllers: [WordController],
  providers: [WordService, PrismaService],
})
export class WordModule {}
