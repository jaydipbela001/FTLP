import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Messages } from 'src/common/messages';
import { Type } from 'class-transformer';

export class CreatePlayerDto {

    @ApiProperty({ example: 'jaydip' })
    @IsNotEmpty({ message: Messages.PLAYER.NAME_REQUIRED })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Bela' })
    @IsNotEmpty({ message: Messages.PLAYER.SURNAME_REQUIRED })
    @IsString()
    surname: string;

    @ApiProperty({ example: 'male' })
    @IsNotEmpty({ message: Messages.PLAYER.GENDER_REQUIRED })
    @IsString()
    gender: string;

    @ApiProperty({ example: 'India' })
    @IsNotEmpty({ message: Messages.PLAYER.COUNTRY_REQUIRED })
    @IsString()
    country: string;

    @ApiProperty({ example: 'Surat' })
    @IsNotEmpty({ message: Messages.PLAYER.CITY_REQUIRED })
    @IsString()
    city: string;

    @ApiProperty({ example: '2004/08/15' })
    @IsNotEmpty({ message: Messages.PLAYER.DOB_REQUIRED })
    @IsDate({ message: Messages.PLAYER.DOB_INVALID })
    @Type(() => Date)
    dob: Date;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Player Profile image file',
    })
    @IsOptional()
    profileImage: string;


    @ApiProperty({ example: 'Gujarat' })
    @IsNotEmpty({ message: Messages.PLAYER.STATE_REQUIRED })
    @IsString()
    state: string;
}
