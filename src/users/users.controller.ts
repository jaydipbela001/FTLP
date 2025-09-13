import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/lib/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCategoryImageOptions } from 'src/service/multer..service';
import { RolesGuard } from 'src/auth/lib/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles("admin")
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles("admin", "user")
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Roles("user", "admin")
  @UseInterceptors(FileInterceptor('profileImage', multerCategoryImageOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserDto })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.update(id, updateUserDto, file);
  }

  @Delete(':id')
  @Roles("user", "admin")
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
