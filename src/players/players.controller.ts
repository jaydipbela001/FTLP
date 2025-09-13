import { Controller, Get, Post, Body, Query, Param, Delete, UseInterceptors, UploadedFile, Put, Patch, UseGuards } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCategoryImageOptions } from 'src/service/multer..service';
import { ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/lib/roles.guard';
import { JwtAuthGuard } from 'src/auth/lib/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) { }

  @Post()
  @Roles("admin")
  @UseInterceptors(FileInterceptor("profileImage", multerCategoryImageOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePlayerDto })
  create(@Body() createPlayerDto: CreatePlayerDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.playersService.create(createPlayerDto, file);
  }


  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @Get()
  @Roles("admin", "user")
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const pageNumber = +(page ?? 1);
    const limitNumber = +(limit ?? 10);
    return this.playersService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  @Roles("user", "admin")
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(id);
  }

  @Patch(':id')
  @Roles("admin")
  @UseInterceptors(FileInterceptor("profileImage", multerCategoryImageOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePlayerDto })
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.playersService.update(id, updatePlayerDto, file);
  }

  @Delete(':id')
  @Roles("admin")
  remove(@Param('id') id: string) {
    return this.playersService.remove(id);
  }

}
