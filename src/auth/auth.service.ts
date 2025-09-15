import { BadRequestException, Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { generateJwtToken, OTP_FUNCTION } from 'src/common/utils';
import { VerifyOtpDto } from './dto/verify-otp';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Messages } from 'src/common/messages';
import { Mailservice } from 'src/service/mail.service';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private readonly useModel: Model<UserDocument>,
    private readonly mailservice: Mailservice
  ) { }

  async signUp(createUserDto: CreateUserDto) {
    try {
      const exsitEmail = await this.useModel.findOne({ email: createUserDto.email });

      if (exsitEmail) {
        throw new BadRequestException(Messages.AUTH.EMAIL_ALREADY_EXISTS);
      }

      const hashPassword = await bcrypt.hash(createUserDto.password, 10);

      const newUser = await this.useModel.create({
        ...createUserDto,
        password: hashPassword,
      });

      const otp = OTP_FUNCTION.generateOtp();
      const otpExpire = OTP_FUNCTION.getOtpExpiryDate();

      newUser.otp = otp;
      newUser.otpSendDate = otpExpire;

      await newUser.save();

      await this.mailservice.sendOtpEmail(newUser.email, newUser.firstname, otp);

      return {
        HttpStatus: HttpStatus.CREATED,
        message: Messages.AUTH.USER_CREATED,
        otp: Messages.AUTH.OTP_SENT,
        data: newUser,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async login(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;
      const user = await this.useModel.findOne({ email });

      if (!user) {
        throw new NotFoundException(Messages.USER.NOT_FOUND);
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new BadRequestException(Messages.AUTH.PASSWORD_INCORRECT);
      }

      const token = generateJwtToken(user.id, user.role);

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.AUTH.LOGIN_SUCCESS,
        data: user,
        token,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      const user = await this.useModel.findOne({ email: verifyOtpDto.email });

      if (!user) {
        throw new NotFoundException(Messages.USER.NOT_FOUND);
      }

      if (!user.otpSendDate || user.otpSendDate <= new Date()) {
        throw new BadRequestException(Messages.AUTH.OTP_EXPIRED);
      }

      if (user.otp !== verifyOtpDto.otp) {
        throw new BadRequestException(Messages.AUTH.OTP_INVALID);
      }

      const token = generateJwtToken(user.id, user.role);

      if (user.forgotPassword) {
        user.otpToken = token;
      }

      user.otp = null;
      user.otpSendDate = null;

      await user.save();

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.AUTH.OTP_VERIFIED,
        token,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.useModel.findOne({ email: forgotPasswordDto.email });

      if (!user) {
        throw new NotFoundException(Messages.USER.NOT_FOUND);
      }
      user.forgotPassword = true;

      const otp = OTP_FUNCTION.generateOtp();
      const otpExpire = OTP_FUNCTION.getOtpExpiryDate();

      user.otp = otp;
      user.otpSendDate = otpExpire;

      await user.save();

      await this.mailservice.sendOtpEmail(user.email, user.firstname, otp);

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.AUTH.OTP_SENT,
        otp
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async resendOtp(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.useModel.findOne({ email: forgotPasswordDto.email });

      if (!user) {
        throw new NotFoundException(Messages.USER.NOT_FOUND);
      }

      const otp = OTP_FUNCTION.generateOtp();
      const otpExpire = OTP_FUNCTION.getOtpExpiryDate();

      user.otp = otp;
      user.otpSendDate = otpExpire;

      await user.save();

      await this.mailservice.sendOtpEmail(user.email, user.firstname, otp);

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.AUTH.OTP_SENT,
        otp
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, otpToken: string) {
    try {
      const user = await this.useModel.findOne({ email: resetPasswordDto.email });

      if (!user) {
        throw new NotFoundException(Messages.USER.NOT_FOUND);
      }

      if (user.otpToken !== otpToken) {
        throw new BadRequestException(Messages.AUTH.INVALID_OTP_TOKEN);
      }

      if (resetPasswordDto.newPassword !== resetPasswordDto.conformPassword) {
        throw new BadRequestException(Messages.AUTH.PASSWORD_NOT_MATCH);
      }

      const hashPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

      user.password = hashPassword;
      user.otp = null;
      user.otpSendDate = null;
      user.forgotPassword = false;
      user.otpToken = null;

      await user.save();

      return {
        HttpStatus: HttpStatus.OK,
        message: Messages.AUTH.PASSWORD_RESET_SUCCESS,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

}
