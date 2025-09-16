import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './entities/team.entity';
import { isValidObjectId, Model } from 'mongoose';
import { EventDocument, Event } from 'src/event/entities/event.entity';
import { Player, PlayerDocument } from 'src/players/entities/player.entity';
import { Types } from 'mongoose';
import { Messages } from 'src/common/messages';
import { User, UserDocument } from 'src/users/entities/user.entity';

@Injectable()
export class TeamService {

  constructor(@InjectModel(Team.name) private readonly teamModel: Model<TeamDocument>,
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    @InjectModel(Player.name) private readonly playerModel: Model<PlayerDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  async create(createTeamDto: CreateTeamDto) {

    if (!isValidObjectId(createTeamDto.eventId)) {
      throw new BadRequestException(Messages.TEAM.CREATE_INVALID_EVENT_ID);
    }

    const name = await this.teamModel.findOne({ name: createTeamDto.name });

    if (name) {
      throw new BadRequestException(Messages.TEAM.CREATE_NAME_EXISTS)
    }

    const user = await this.userModel.findById(createTeamDto.userId);
    if (!user) throw new NotFoundException(Messages.TEAM.CREATE_USER_NOT_FOUND);

    const event = await this.eventModel.findById(createTeamDto.eventId);
    if (!event) throw new NotFoundException(Messages.TEAM.CREATE_EVENT_NOT_FOUND);

    const now = Date.now();
    if (event.starttime <= now) {
      throw new BadRequestException(Messages.TEAM.CREATE_EVENT_STARTED);
    }

    const players = await this.playerModel.find({
      _id: { $in: createTeamDto.players }
    });


    for (const player of players) {
      const playerId = player._id as Types.ObjectId;
      const isInEvent = event.playerlist.some(id => id.toString() === playerId.toString());

      if (!isInEvent) {
        throw new BadRequestException(`Player ${player.name} is not part of the event`);
      }
    }

    if (players.length !== 10) {
      throw new BadRequestException("Add 10 players");
    }

    const maleCount = players.filter(p => p.gender === "male").length;
    const femaleCount = players.filter(p => p.gender === "female").length;

    if (maleCount !== 5 || femaleCount !== 5) {
      throw new BadRequestException(Messages.TEAM.CREATE_GENDER_DISTRIBUTION_INVALID);
    }

    const newTeam = new this.teamModel({
      name: createTeamDto.name,
      userID: createTeamDto.userId,
      eventId: new Types.ObjectId(createTeamDto.eventId),
      players: players.map(p => p._id),
    });

    return {
      HttpStatus: HttpStatus.CREATED,
      message: Messages.TEAM.CREATE_SUCCESS,
      data: await newTeam.save(),
    };
  }

  async findAll() {
    try {
      const teams = await this.teamModel.find().populate('players').populate("eventId", "-playerlist").populate("userID").exec();

      if (!teams || teams.length === 0) {
        throw new NotFoundException(Messages.TEAM.FIND_NOT_FOUND);
      }

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.TEAM.FETCH_SUCCESS,
        data: teams
      };

    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {

      if (!isValidObjectId(id)) {
        throw new BadRequestException(Messages.TEAM.INVALID_TEAM_ID);
      }
      const team = await this.teamModel.findById(id).populate("players").populate("eventId", "-playerlist").populate("userID");

      if (!team) {
        throw new NotFoundException(Messages.TEAM.FIND_NOT_FOUND);
      }

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.TEAM.FETCH_ONE_SUCCESS,
        data: team
      };

    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(teamId: string, updateTeamDto: UpdateTeamDto) {
    try {

      if (!isValidObjectId(teamId)) {
        throw new BadRequestException(Messages.TEAM.INVALID_TEAM_ID);
      }

      const team = await this.teamModel.findById(teamId);

      if (!team) {
        throw new NotFoundException(Messages.TEAM.FIND_NOT_FOUND)
      }

      const event = await this.eventModel.findById(updateTeamDto.eventId);

      if (!event) {
        throw new NotFoundException(Messages.TEAM.CREATE_EVENT_NOT_FOUND);
      }

      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      if (event.starttime - now <= oneHour) {
        throw new BadRequestException(Messages.TEAM.CANNOT_UPDATE_ONE_HOUR_BEFORE_EVENT);
      }

      if (updateTeamDto.players && updateTeamDto.players.length > 0) {
        const players = await this.playerModel.find({
          _id: { $in: updateTeamDto.players }
        });

        if (players.length !== 10) {
          throw new BadRequestException(Messages.TEAM.CREATE_PLAYER_COUNT_INVALID);
        }

        const maleCount = players.filter(p => p.gender === "male").length;
        const femaleCount = players.filter(p => p.gender === "female").length;

        if (maleCount !== 5 || femaleCount !== 5) {
          throw new BadRequestException(Messages.TEAM.CREATE_GENDER_DISTRIBUTION_INVALID);
        }

        for (const player of players) {

          const playerId = player._id as Types.ObjectId;
          const isInEvent = event.playerlist.some(id => id.toString() === playerId.toString());

          if (!isInEvent) {
            throw new BadRequestException(`Player ${player.name} is not part of the event`);
          }
        }

        team.players = players.map(p => p._id as Types.ObjectId) as Types.ObjectId[];
      }

      if (updateTeamDto.name) {
        team.name = updateTeamDto.name;
      }

      await team.save();

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.TEAM.UPDATE_SUCCESS,
        data: team,
      };

    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(Messages.TEAM.INVALID_TEAM_ID);
      }
      const team = await this.teamModel.findById(id);

      if (!team) {
        throw new NotFoundException("Team is not found")
      }

      await this.teamModel.findByIdAndDelete(id);

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.TEAM.REMOVE_SUCCESS,
        data: team,
      };

    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }


}
