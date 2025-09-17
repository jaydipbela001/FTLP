import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Leaderboard, LeaderboardDocument } from './entities/leaderboard.entity';
import { Model } from 'mongoose';
import { Team, TeamDocument } from 'src/team/entities/team.entity';
import { Player, PlayerDocument } from 'src/players/entities/player.entity';
import { calculatePerformancePoint } from 'src/common/utils';
import { RacePlayerPointDto } from './dto/race-point.dto';

@Injectable()
export class LeaderboardService {
  constructor(@InjectModel(Leaderboard.name) private readonly leaderboardModel: Model<LeaderboardDocument>,
    @InjectModel(Team.name) private readonly teamModel: Model<TeamDocument>,
    @InjectModel(Player.name) private readonly playerModel: Model<PlayerDocument>) { }


  async calculateLeaderboard(eventId: string) {
    const teams = await this.teamModel.find({ eventId }).populate('players');

    for (const team of teams) {
      const totalPoint = (team.players as any).reduce(
        (sum, player) => sum + (player.point || 0),
        0
      );

      team.teampoint = totalPoint;
      await team.save();
    }
  }

  async getLeaderBoard(eventId: string) {
    const leaderboard = await this.teamModel
      .find({ eventId })
      .populate('userID', 'firstname lastname')
      .populate('players', 'name point')
      .sort({ teampoint: -1 });

    if (leaderboard.length === 0) {
      throw new NotFoundException('No teams found for this event');
    }

    return {
      HttpStatus: HttpStatus.OK,
      message: 'Leaderboard fetched successfully',
      data: leaderboard.map(team => ({
        teamId: team._id,
        teamName: team.name,
        userName: `${(team.userID as { firstname?: string; })?.firstname || ''} ${(team.userID as { lastname?: string })?.lastname || ''}`.trim() || 'Unknown User',
        totalPoint: team.teampoint,
      })),
    };
  };

  async getTeamDetail(teamId: string) {
    const team = await this.teamModel.findById(teamId)
      .populate("players", "name point")
      .populate('userID', 'firstname lastname')

    if (!team) {
      throw new NotFoundException("Team is not founds")
    }

    return {
      HttpStatus: HttpStatus.OK,
      message: 'Team details fetched successfully',
      data: {
        teamId: team._id,
        teamName: team.name,
        userName: `${(team.userID as { firstname?: string; })?.firstname || ''} ${(team.userID as { lastname?: string })?.lastname || ''}`.trim() || 'Unknown User',
        totalPoint: team.teampoint,
        players: (team.players as any).map(player => ({
          playerId: player._id,
          name: player.name,
          point: player.point,
        })),

      }
    }
  }

  async updatePlayerPointAutomatically(playerId: string, racePlayerPoint: RacePlayerPointDto) {
    const player = await this.playerModel.findById(playerId);
    if (!player) throw new NotFoundException('Player not found');

    const { runKm, runTime, bikeKm, bikeTime, swimKm, swimTime } = racePlayerPoint;

    const calculatedPoints = calculatePerformancePoint(runKm, runTime, bikeKm, bikeTime, swimKm, swimTime);

    player.point = calculatedPoints;
    await player.save();

    return {
      HttpStatus: HttpStatus.OK,
      message: 'Player point calculated and updated successfully',
      data: player,
    };
  }

}
