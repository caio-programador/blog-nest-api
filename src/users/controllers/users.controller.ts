import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('details')
  async details(@Req() request: Request): Promise<User> {
    return this.usersService.details(request);
  }

  @Patch('edit')
  @UseGuards(AuthGuard('jwt'))
  async update(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(request, updateUserDto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Req() request: Request) {
    await this.usersService.remove(request);

  }
}
