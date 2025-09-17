import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PlayersModule } from './players/players.module';
import { EventModule } from './event/event.module';
import { TeamModule } from './team/team.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  MongooseModule.forRoot(process.env.MONGODB_URI || "", {
    connectionFactory: (connection) => {
      console.log("connected to mongodb");
      return connection;
    }
  }
  ), AuthModule, UsersModule, PlayersModule, EventModule, TeamModule, LeaderboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
