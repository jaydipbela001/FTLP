
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Messages } from 'src/common/messages';

export class VerifyOtpDto {
    @ApiProperty({ example: 'jaydipbela1625@gmail.com' })
    @IsNotEmpty({ message: Messages.AUTH.EMAIL_REQUIRED })
    @IsEmail({}, { message: Messages.AUTH.EMAIL_INVALID })
    email: string;

    @ApiProperty({ example: 1111, description: "One Time Otp" })
    @IsNotEmpty({ message: Messages.AUTH.OTP_REQUIRED })
    @Type(() => Number)
    otp: number;
}