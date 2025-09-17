import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiQuery } from '@nestjs/swagger';
import { AddPlayerDto } from './dto/add-player.dto';
import { JwtAuthGuard } from 'src/auth/lib/jwt-auth.guard';
import { RolesGuard } from 'src/auth/lib/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Post()
  // @Roles("admin")
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'filter', required: false, type: String, description: 'Filter with location , player , time' })
  @Get('')
  @Roles("admin", "user")
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('filter') filter?: string,
  ) {
    const pageNumber = +(page ?? 1);
    const limitNumber = +(limit ?? 50);
    const filterString = filter ?? "";
    return this.eventService.findAll(pageNumber, limitNumber, filterString);
  }

  @Patch(':id/add-player')
  // @Roles("admin")
  addPlayer(
    @Param('id') eventId: string,
    @Body() addPlayerDto: AddPlayerDto
  ) {
    return this.eventService.addPlayer(eventId, addPlayerDto);
  }

  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @Get(':id/playerlist')
  @Roles("admin", "user")
  getPlayerList(@Param('id') eventId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const pageNumber = +(page ?? 1);
    const limitNumber = +(limit ?? 10);
    return this.eventService.getPlayerListByEventId(eventId, pageNumber, limitNumber);
  }

  @Get(':id')
  @Roles("admin", "user")
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  @Roles("admin")
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @Roles("admin")
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
