
import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Messages } from 'src/common/messages';

export class ForgotPasswordDto {
    @ApiProperty({ example: 'jaydipbela1625@gmail.com' })
    @IsNotEmpty({ message: Messages.AUTH.EMAIL_REQUIRED })
    @IsEmail({}, { message: Messages.AUTH.EMAIL_INVALID })
    email: string;

}