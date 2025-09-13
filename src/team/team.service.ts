import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './entities/team.entity';
import { isValidObjectId, Model } from 'mongoose';
import { EventDocument } from 'src/event/entities/event.entity';
import { Player, PlayerDocument } from 'src/players/entities/player.entity';
import { Types } from 'mongoose';

@Injectable()
export class TeamService {

  constructor(@InjectModel(Team.name) private readonly teamModel: Model<TeamDocument>,
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    @InjectModel(Player.name) private readonly playerModel: Model<PlayerDocument>,
  ) { }

  // async create(createTeamDto: CreateTeamDto) {

  //   if (!isValidObjectId(createTeamDto.eventId)) {
  //     throw new BadRequestException("Invalid Event ID")
  //   }

  //   const event = await this.eventModel.findById(createTeamDto.eventId);
  //   if (!event) {
  //     throw new NotFoundException("Event is not found");
  //   }

  //   const players = await this.playerModel.find({
  //     _id: { $in: createTeamDto.players }
  //   });

  //   for (const player of players) {

  //     const EventList = event.playerlist.some(p => p._id === player._id);

  //     if (!EventList) {
  //       throw new BadRequestException(`Player ${player} is not part of the event`);
  //     }
  //   }

  //   if (players.length !== 10) {
  //     throw new BadRequestException("Add 10 player ")
  //   }

  //   const malePlayer = players.filter(player => player.gender === "male").length;
  //   const femalePlayer = players.filter(player => player.gender === "female").length;

  //   if (malePlayer !== 5 || femalePlayer !== 5) {
  //     throw new BadRequestException("select 5 male and 5 female")
  //   }


  //   // const creatTeam = await this.teamModel.create({
  //   //   ...createTeamDto, players: ...teamPlayer
  //   // })
  //   const newTeam = new this.teamModel({
  //     name: createTeamDto.name,
  //     players: players,
  //     event: createTeamDto.eventId
  //   });
  //   return await newTeam;
  //   // return creatTeam;

  // }
  async create(createTeamDto: CreateTeamDto) {
    if (!isValidObjectId(createTeamDto.eventId)) {
      throw new BadRequestException("Invalid Event ID");
    }

    const event = await this.eventModel.findById(createTeamDto.eventId);
    if (!event) throw new NotFoundException("Event is not found");

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
      throw new BadRequestException("Select 5 male and 5 female players");
    }

    const newTeam = new this.teamModel({
      name: createTeamDto.name,
      userID: createTeamDto.userId,
      eventId: new Types.ObjectId(createTeamDto.eventId),
      players: players.map(p => p._id),
    });

    return await newTeam.save();
  }

  findAll() {
    return `This action returns all team`;
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
