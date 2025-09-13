import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPlayerDto {
    @ApiProperty({ example: ['68c00a86be9f648be9206385', '68c00a86be9f648be9206386'] })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    playerIds: string[];
}
