import {
    BadRequestException,
    HttpStatus,
    Injectable,
    NotFoundException,
    HttpException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Messages } from '../common/messages';


@Injectable()

export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) { }

    async findAll() {
        try {
            const users = await this.userModel.find().exec();

            if (!users) {
                throw new NotFoundException(Messages.USER.NOT_FOUND);
            }
            return {
                statusCode: HttpStatus.OK,
                message: Messages.USER.USERS_FETCHED_SUCCESSFULLY,
                data: users,
            };

        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
        }
    }

    async findOne(id: string) {
        try {
            if (!isValidObjectId(id)) {
                throw new BadRequestException(Messages.USER.INVALID_ID);
            }
            const user = await this.userModel.findById(id).exec();

            if (!user) {
                throw new NotFoundException(Messages.USER.NOT_FOUND);
            }
            return {
                HttpStatus: HttpStatus.OK,
                message: Messages.USER.USER_FETCHED_SUCCESSFULLY,
                data: user,
            };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto, file: Express.Multer.File) {
        try {
            if (!isValidObjectId(id)) {
                throw new BadRequestException(Messages.USER.INVALID_ID);
            }

            const existingUser = await this.userModel.findById(id);
            if (!existingUser) {
                throw new NotFoundException(Messages.USER.NOT_FOUND);
            }

            if (!file) {
                throw new BadRequestException(Messages.USER.PROFILE_IMAGE_REQUIRED);
            }

            updateUserDto.profileImage = `/uploads/${file.filename}`;

            const updateUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });

            if (!updateUser) {
                throw new BadRequestException(Messages.USER.UPDATE_FAILED);
            }

            await updateUser.save()
            return {
                HttpStatus: HttpStatus.OK,
                message: Messages.USER.UPDATE_SUCCESS,
                data: updateUser,
            };

        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
        }
    }

    async remove(id: string) {
        try {
            if (!isValidObjectId(id)) {
                throw new BadRequestException(Messages.USER.INVALID_ID);
            }

            const user = await this.userModel.findById(id).exec();
            if (!user) {
                throw new NotFoundException(Messages.USER.NOT_FOUND);
            }

            await this.userModel.findByIdAndDelete(id).exec();

            return {
                HttpStatus: HttpStatus.OK,
                message: Messages.USER.DELETE_SUCCESS,
                data: user,
            };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
        }
    }
}
