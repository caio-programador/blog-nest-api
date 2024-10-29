import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../entities/user.entity';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { RoleEnum } from '../../enums/role.enum';
import { RolesGuard } from '../../guards/roles.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 409,
    description: 'Email já cadastrado',
  })
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Acesso negado' })
  @UseGuards(AuthGuard('jwt'))
  @Get('details')
  async details(@Req() request: Request): Promise<User> {
    return this.usersService.details(request);
  }
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Acesso negado' })
  @Patch('edit')
  @UseGuards(AuthGuard('jwt'))
  async update(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(request, updateUserDto);
  }
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Acesso negado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Req() request: Request) {
    await this.usersService.remove(request);
  }

  @Get()
  @Roles(RoleEnum.ADMIN)
  @ApiForbiddenResponse({ description: 'Você precisa ser um admin' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
