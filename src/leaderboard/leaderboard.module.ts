import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Leaderboard, LeaderboardSchema } from './entities/leaderboard.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { Team, TeamSchema } from 'src/team/entities/team.entity';
import { Player, PlayerSchema } from 'src/players/entities/player.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Leaderboard.name, schema: LeaderboardSchema },
  { name: User.name, schema: UserSchema }, { name: Team.name, schema: TeamSchema }, { name: Player.name, schema: PlayerSchema }
  ])],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
})
export class LeaderboardModule { }
