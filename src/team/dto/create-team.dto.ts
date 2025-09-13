import { IsNotEmpty, IsString, IsOptional, IsDate, IsArray, ArrayNotEmpty, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Messages } from 'src/common/messages';


export class CreateTeamDto {

    @ApiProperty({ example: 'Team A' })
    @IsNotEmpty({ message: 'TeamName is required' })
    @IsString()
    name: string;

    @ApiProperty({ example: '68c41a29993d76a1064aaf16' })
    @IsNotEmpty({ message: 'EventId is required' })
    @IsString()
    eventId: string;

    @ApiProperty({ example: '68c2bc1b14fc5e0f77397cec' })
    @IsNotEmpty({ message: 'UserId is required' })
    @IsString()
    userId: string;

    @ApiProperty({ example: ['68c3f6ecad75339f1464cd41', '68c3f70aad75339f1464cd43', '68c3f770ad75339f1464cd49', '68c3f784ad75339f1464cd4b', '68c3f78dad75339f1464cd4d', '68c3f735ad75339f1464cd45', '68c3f758ad75339f1464cd47', '68c3f7cead75339f1464cd51', '68c3f7dead75339f1464cd53', '68c3f7f3ad75339f1464cd55'] })
    @IsArray()
    @ArrayNotEmpty()
    // @ArrayMinSize(10)
    // @ArrayMaxSize(10)
    @IsString({ each: true })
    players: string[];
}




