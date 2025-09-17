import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { RacePlayerPointDto } from './dto/race-point.dto';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) { }

  @Get(':eventId')
  getLeaderBoard(@Param('eventId') eventId: string) {
    return this.leaderboardService.getLeaderBoard(eventId);
  }

  @Get('team/:teamId')
  getTeamDetail(@Param('teamId') teamId: string) {
    return this.leaderboardService.getTeamDetail(teamId);
  }

  @Get('teampoint/:eventId')
  calculateLeaderboard(@Param('eventId') eventId: string) {
    return this.leaderboardService.calculateLeaderboard(eventId);
  }

  @Post('calculate-point/:playerId')
  async calculatePoint(
    @Param('playerId') playerId: string,
    @Body() racePlayerPoint: RacePlayerPointDto
  ) {
    return this.leaderboardService.updatePlayerPointAutomatically(playerId, racePlayerPoint);

  }

}
