
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Messages } from 'src/common/messages';
import { Type } from 'class-transformer';

export class CreateEventDto {

    @ApiProperty({ example: 'event' })
    @IsNotEmpty({ message: "title is required" })
    @IsString()
    title: string;

    @ApiProperty({ example: 'this event is run race, bike race ,swim race' })
    @IsNotEmpty({ message: "descriptionis required" })
    @IsString()
    description: string;

    @ApiProperty({ example: 'amroli' })
    @IsNotEmpty({ message: 'location is required' })
    @IsString()
    location: string;

    @ApiProperty({ example: '2004/08/15' })
    @IsNotEmpty({ message: 'startDate is required' })
    @IsDate({ message: Messages.USER.AGE_INVALID })
    @Type(() => Date)
    startdate: Date;

    @ApiProperty({ example: 15 })
    @IsNotEmpty({ message: 'runkm is required' })
    @Type(() => Number)
    runkm: number;

    @ApiProperty({ example: 10 })
    @IsNotEmpty({ message: 'bikekm is required' })
    @Type(() => Number)
    bikekm: number;

    @ApiProperty({ example: 10 })
    @IsNotEmpty({ message: 'swimkm is required' })
    @Type(() => Number)
    swimkm: number;

    @ApiProperty({ example: 30, description: 'Runtime in HH:MM:SS format' })
    @IsNotEmpty({ message: 'Runtime is required' })
    @Type(() => Number)
    runtime: number;

    @ApiProperty({ example: 10, description: 'biketime in HH:MM:SS format' })
    @IsNotEmpty({ message: 'biketime is required' })
    @Type(() => Number)
    biketime: number;

    @ApiProperty({ example: 15, description: 'swimtime in HH:MM:SS format' })
    @IsNotEmpty({ message: 'swimtime is required' })
    @Type(() => Number)
    swimtime: number;


}


