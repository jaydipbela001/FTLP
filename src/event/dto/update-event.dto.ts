// import { PartialType } from '@nestjs/swagger';
// import { CreateEventDto } from './create-event.dto';

// export class UpdateEventDto extends PartialType(CreateEventDto) {}


import { IsOptional, IsNotEmpty, IsString, IsDate, IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Messages } from 'src/common/messages';
import { Type } from 'class-transformer';

export class UpdateEventDto {

    @ApiPropertyOptional({ example: 'event' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: 'this event is run race, bike race, swim race' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 'amroli' })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiPropertyOptional({ example: '2004/08/15' })
    @IsOptional()
    @IsDate({ message: Messages.USER.AGE_INVALID })
    @Type(() => Date)
    startdate?: Date;

    @ApiPropertyOptional({ example: 15 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    runkm?: number;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    bikekm?: number;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    swimkm?: number;

    @ApiPropertyOptional({ example: 30, description: 'Runtime in HH:MM:SS format' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    runtime?: number;

    @ApiPropertyOptional({ example: 10, description: 'biketime in HH:MM:SS format' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    biketime?: number;

    @ApiPropertyOptional({ example: 15, description: 'swimtime in HH:MM:SS format' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    swimtime?: number;

    @ApiPropertyOptional({ example: ['68c00a86be9f648be9206385', '68c00a86be9f648be9206386'] })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    playerlist?: string[];
}



