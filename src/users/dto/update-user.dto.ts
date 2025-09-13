import { IsNotEmpty, IsString, MaxLength, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Messages } from 'src/common/messages';
import { Type } from 'class-transformer';

export class UpdateUserDto {

    @ApiProperty({ example: 'jaydip' })
    @IsNotEmpty({ message: Messages.USER.FIRSTNAME_REQUIRED })
    @IsString()
    firstname: string;

    @ApiProperty({ example: 'Bela' })
    @IsNotEmpty({ message: Messages.USER.LASTNAME_REQUIRED })
    @IsString()
    lastname: string;

    @ApiProperty({ example: 'Male' })
    @IsNotEmpty({ message: Messages.USER.GENDER_REQUIRED })
    @IsString()
    gender: string;

    @ApiProperty({ example: 'India' })
    @IsNotEmpty({ message: Messages.USER.COUNTRY_REQUIRED })
    @IsString()
    country: string;

    @ApiProperty({ example: '2004/08/15' })
    @IsNotEmpty({ message: Messages.USER.AGE_REQUIRED })
    @IsDate({ message: Messages.USER.AGE_INVALID })
    @Type(() => Date)
    age: Date;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Profile image file (upload)',
    })
    @IsOptional()
    profileImage: string;

    @ApiProperty({ example: 'India' })
    @IsNotEmpty({ message: Messages.USER.CAPTION_REQUIRED })
    @IsString()
    @MaxLength(60, { message: Messages.USER.CAPTION_MAX_LENGTH })
    caption: string;
}
