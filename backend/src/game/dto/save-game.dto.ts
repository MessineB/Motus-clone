// src/game/dto/save-game.dto.ts
import { IsString, IsArray, IsEnum, IsOptional } from 'class-validator';

export class SaveGameDto {
  @IsString()
  wordId: string;

  @IsArray()
  attempts: string[];

  @IsEnum(['WIN', 'LOSE'])
  status: 'WIN' | 'LOSE';

  @IsOptional()
  @IsString()
  anonId?: string;
}
