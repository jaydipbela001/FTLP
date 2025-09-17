import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RacePlayerPointDto {
    @ApiProperty({ example: 5, description: 'Distance run in kilometers' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    runKm: number;

    @ApiProperty({ example: 1680, description: 'Run time in seconds (e.g., 28 min = 28*60)' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    runTime: number;

    @ApiProperty({ example: 20, description: 'Distance biked in kilometers' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    bikeKm: number;

    @ApiProperty({ example: 3300, description: 'Bike time in seconds (e.g., 55 min = 55*60)' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    bikeTime: number;

    @ApiProperty({ example: 2, description: 'Distance swum in kilometers' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    swimKm: number;

    @ApiProperty({ example: 1080, description: 'Swim time in seconds (e.g., 18 min = 18*60)' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    swimTime: number;
}
