import { BadRequestException, Injectable, HttpStatus, HttpException, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Player, PlayerDocument } from './entities/player.entity';
import { Model, isValidObjectId } from 'mongoose';
import { Messages } from 'src/common/messages';

@Injectable()
export class PlayersService {
  constructor(@InjectModel(Player.name) private readonly playerModel: Model<PlayerDocument>) { }

  async create(createPlayerDto: CreatePlayerDto, file: Express.Multer.File) {
    try {

      if (!file) {
        throw new BadRequestException(Messages.PLAYER.PROFILE_IMAGE_REQUIRED);
      }

      createPlayerDto.profileImage = `/uploads/${file.filename}`;

      const player = await this.playerModel.create(createPlayerDto);

      if (!player) {
        throw new BadRequestException(Messages.PLAYER.CREATE_FAIL);
      }

      return {
        HttpStatus: HttpStatus.CREATED,
        message: Messages.PLAYER.CREATE_SUCCESS,
        data: player,
      };

    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(page: number, limit: number) {
    try {
      const skip = (Math.max(page, 1) - 1) * limit;
      const [data, total] = await Promise.all([
        this.playerModel.find().skip(skip).limit(limit),
        this.playerModel.countDocuments()
      ]);

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.PLAYER.FETCH_SUCCESS,
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(Messages.PLAYER.INVALID_ID);
      }

      const player = await this.playerModel.findById(id);

      if (!player) {
        throw new NotFoundException(Messages.PLAYER.NOT_FOUND);
      }

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.PLAYER.FETCH_ONE_SUCCESS,
        data: player,
      };

    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto, file: Express.Multer.File) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(Messages.PLAYER.INVALID_ID);
      }

      const existingPlayer = await this.playerModel.findById(id).exec();

      if (!existingPlayer) {
        throw new NotFoundException(Messages.PLAYER.NOT_FOUND);
      }

      if (file) {
        updatePlayerDto.profileImage = `/uploads/${file.filename}`;
      } else {
        updatePlayerDto.profileImage = existingPlayer.profileImage;
      }

      const updatePlayer = await this.playerModel.findByIdAndUpdate(id, updatePlayerDto, { new: true }).exec();

      if (!updatePlayer) {
        throw new BadRequestException(Messages.PLAYER.UPDATE_FAIL);
      }

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.PLAYER.UPDATE_SUCCESS,
        data: updatePlayer,
      };

    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(Messages.PLAYER.INVALID_ID);
      }

      const player = await this.playerModel.findById(id);

      if (!player) {
        throw new NotFoundException(Messages.PLAYER.NOT_FOUND);
      }

      await this.playerModel.findByIdAndDelete(id);

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.PLAYER.DELETE_SUCCESS,
        data: player,
      };

    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
