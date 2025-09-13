
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Messages } from 'src/common/messages';

export class CreateUserDto {
    @ApiProperty({ example: 'jaydipbela1625@gmail.com' })
    @IsNotEmpty({ message: Messages.AUTH.EMAIL_REQUIRED })
    @IsEmail({}, { message: Messages.AUTH.EMAIL_INVALID })
    email: string;

    @ApiProperty({ example: 'jay123' })
    @IsNotEmpty({ message: Messages.AUTH.PASSWORD_REQUIRED })
    @IsString()
    password: string;

}