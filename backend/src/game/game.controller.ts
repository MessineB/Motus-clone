import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { SaveGameDto } from './dto/save-game.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('save')
  //@UseGuards(JwtAuthGuard) // Enlève si tu veux autoriser les non-connectés
  save(@Body() dto: SaveGameDto, @Req() req) {
    const userId = req.user?.sub;
    return this.gameService.saveGame(dto, userId);
  }
}
