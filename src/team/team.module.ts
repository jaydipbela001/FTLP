import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './entities/team.entity';
import { EventSchema } from 'src/event/entities/event.entity';
import { Player, PlayerSchema } from 'src/players/entities/player.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }, { name: Event.name, schema: EventSchema }, { name: Player.name, schema: PlayerSchema }, { name: User.name, schema: UserSchema }])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule { }
