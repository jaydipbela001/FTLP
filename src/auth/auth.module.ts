import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { JwtStrategy } from './lib/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { Mailservice } from 'src/service/mail.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtService, Mailservice],
})
export class AuthModule { }
