import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Messages } from 'src/common/messages';

export class ResetPasswordDto {

    @ApiProperty({ example: 'jaydipbela1625@gmail.com' })
    @IsNotEmpty({ message: Messages.AUTH.EMAIL_REQUIRED })
    @IsEmail({}, { message: Messages.AUTH.EMAIL_INVALID })
    email: string;

    @ApiProperty({ example: "jay1234" })
    @IsNotEmpty({ message: Messages.AUTH.NEW_PASSWORD_REQUIRED })
    @IsString()
    newPassword: string;

    @ApiProperty({ example: "jay1234" })
    @IsNotEmpty({ message: Messages.AUTH.CONFIRM_PASSWORD_REQUIRED })
    @IsString()
    conformPassword: string;
}
