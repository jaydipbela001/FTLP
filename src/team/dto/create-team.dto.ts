import { IsNotEmpty, IsString, IsOptional, IsDate, IsArray, ArrayNotEmpty, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Messages } from 'src/common/messages';


export class CreateTeamDto {

    @ApiProperty({ example: 'Team A' })
    @IsNotEmpty({ message: 'TeamName is required' })
    @IsString()
    name: string;

    @ApiProperty({ example: '68c7d228b255a4bfdbf9397d' })
    @IsNotEmpty({ message: 'EventId is required' })
    @IsString()
    eventId: string;

    @ApiProperty({ example: '68c56c0217d69e09351f4b13' })
    @IsNotEmpty({ message: 'UserId is required' })
    @IsString()
    userId: string;

    @ApiProperty({
        example: [
            '68c7b707adaee17755fda55a',
            '68c7d022200a69b56ab10448',
            '68c7d032200a69b56ab1044a',
            '68c7d038200a69b56ab1044c',
            '68c7d03f200a69b56ab1044e',
            '68c7d072200a69b56ab10456',
            '68c7d118200a69b56ab10458',
            '68c7d121200a69b56ab1045a',
            '68c7d131200a69b56ab1045c',
            '68c7d14a200a69b56ab1045e'
        ],
    })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(10)
    @ArrayMaxSize(10)
    @IsString({ each: true })
    players: string[];
}




