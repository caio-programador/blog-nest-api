import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('details')
  async details(@Req() request: Request) {
    return this.usersService.details(request);
  }

  @Patch('edit')
  async update(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(request, updateUserDto);
  }

  @Delete('delete')
  async remove(@Req() request: Request) {
    return this.usersService.remove(request);
  }
}
