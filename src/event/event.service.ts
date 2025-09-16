import { Injectable, HttpStatus, HttpException, BadRequestException, NotFoundException, BadGatewayException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { EventDocument } from './entities/event.entity';
import { dateToMilliseconds, timeToseconds } from 'src/common/utils';
import { AddPlayerDto } from './dto/add-player.dto';
import { Player, PlayerDocument } from 'src/players/entities/player.entity';
import { Messages } from 'src/common/messages';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    @InjectModel(Player.name) private readonly playerModel: Model<PlayerDocument>
  ) { }

  async create(createEventDto: CreateEventDto) {
    try {
      const eventTitle = await this.eventModel.findOne({ title: createEventDto.title });

      if (eventTitle) {
        throw new BadGatewayException(Messages.EVENT.CREATE_TITLE_EXISTS);
      }

      const startDate = dateToMilliseconds(createEventDto.startdate);
      const runtime = timeToseconds(createEventDto.runtime);
      const biketime = timeToseconds(createEventDto.biketime);
      const swimtime = timeToseconds(createEventDto.swimtime);
      const now = Date.now();

      if (createEventDto.starttime <= now) {
        throw new BadRequestException(Messages.EVENT.CREATE_STARTTIME_INVALID);
      }

      const event = await this.eventModel.create({
        ...createEventDto,
        startdate: startDate,
        runtime,
        biketime,
        swimtime
      });

      return {
        HttpStatus: HttpStatus.CREATED,
        message: Messages.EVENT.CREATE_SUCCESS,
        data: event,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(page: number, limit: number, filter: string) {
    try {
      const skip = (Math.max(page, 1) - 1) * limit;

      const pipeline = [
        {
          $lookup: {
            from: 'players',
            localField: 'playerlist',
            foreignField: '_id',
            as: 'players'
          }
        },
        { $unwind: { path: "$players", preserveNullAndEmptyArrays: true } },
        {
          $match: {
            $or: [
              { location: { $regex: filter, $options: "i" } },
              { startdate: +filter || -1 },
              { "players.name": { $regex: filter, $options: "i" } },
            ]
          }
        },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            location: { $first: "$location" },
            startdate: { $first: "$startdate" },
            starttime: { $first: "$starttime" },
            runkm: { $first: "$runkm" },
            bikekm: { $first: "$bikekm" },
            swimkm: { $first: "$swimkm" },
            runtime: { $first: "$runtime" },
            biketime: { $first: "$biketime" },
            swimtime: { $first: "$swimtime" },
            players: { $push: "$players" }
          }
        },
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [{ $skip: skip }, { $limit: limit }]
          }
        }
      ];

      const result = await this.eventModel.aggregate(pipeline);
      const metadata = result[0].metadata[0] || { total: 0 };
      const data = result[0].data;

      if (!data || data.length === 0) {
        throw new NotFoundException(Messages.EVENT.NOT_FOUND);
      }

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.EVENT.FETCH_LIST_SUCCESS,
        data,
        total: metadata.total,
        page,
        limit,
        totalPages: Math.ceil(metadata.total / limit)
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async getPlayerListByEventId(eventId: string, page: number, limit: number) {
    const skip = (Math.max(page, 1) - 1) * limit;

    const event = await this.eventModel.findById(eventId).exec();

    if (!event) {
      throw new NotFoundException(Messages.EVENT.NOT_FOUND);
    }

    const [data, total] = await Promise.all([
      this.playerModel.find({ _id: { $in: event.playerlist } }).skip(skip).limit(limit).exec(),
      this.playerModel.countDocuments({ _id: { $in: event.playerlist } })
    ]);

    if (!data || data.length === 0) {
      throw new NotFoundException(Messages.EVENT.NOT_FOUND);
    }

    return {
      HttpStatus: HttpStatus.OK,
      message: Messages.EVENT.FETCH_SUCCESS,
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async addPlayer(eventId: string, addPlayerDto: AddPlayerDto) {
    try {
      if (!isValidObjectId(eventId)) {
        throw new BadRequestException(Messages.EVENT.NOT_FOUND);
      }

      const event = await this.eventModel.findById(eventId);

      if (!event) {
        throw new NotFoundException(Messages.EVENT.NOT_FOUND);
      }

      if (addPlayerDto.playerIds) {
        await this.addPlayerList(event, addPlayerDto.playerIds);
      }

      const data = await event.save();

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.EVENT.PLAYERS_ADDED_SUCCESS,
        data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(Messages.EVENT.INVALID_ID);
      }

      const event = await this.eventModel.findById(id).populate("playerlist");

      if (!event) {
        throw new NotFoundException(Messages.EVENT.NOT_FOUND);
      }

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.EVENT.FETCH_SUCCESS,
        data: event,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(Messages.EVENT.INVALID_ID);
      }

      const event = await this.eventModel.findById(id);

      if (!event) {
        throw new NotFoundException(Messages.EVENT.NOT_FOUND);
      }

      const now = Date.now();
      if (updateEventDto.starttime && updateEventDto.starttime <= now) {
        throw new BadRequestException(Messages.EVENT.CREATE_STARTTIME_INVALID);
      }

      if (updateEventDto.playerlist) {
        await this.addPlayerList(event, updateEventDto.playerlist);
      }

      const updateEvent = await this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true });

      if (!updateEvent) {
        throw new BadRequestException(Messages.EVENT.UPDATE_FAIL);
      }

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.EVENT.UPDATE_SUCCESS,
        updateEvent,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(Messages.EVENT.INVALID_ID);
      }

      const event = await this.eventModel.findById(id);

      if (!event) {
        throw new NotFoundException(Messages.EVENT.NOT_FOUND);
      }

      await this.eventModel.findByIdAndDelete(id);

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.EVENT.DELETE_SUCCESS,
        data: event,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  private async addPlayerList(event: EventDocument, playerIds: string[]) {
    const playerObjectIds: Types.ObjectId[] = [];

    for (const playerId of playerIds) {
      if (!isValidObjectId(playerId)) {
        throw new BadRequestException("Invalid Id");
      }
      const player = await this.playerModel.findById(playerId);
      if (!player) {
        throw new NotFoundException(`Player with ID ${playerId} not found`);
      }
      playerObjectIds.push(new Types.ObjectId(playerId));
    }

    event.playerlist = playerObjectIds;
  }
}
