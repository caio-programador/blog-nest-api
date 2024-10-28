import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Acesso negado' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() request: Request, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(request, createPostDto);
  }

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }
  @ApiNotFoundResponse({ description: 'Post não encontrado' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Acesso negado' })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(request, +id, updatePostDto);
  }

  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Post não encontrado' })
  @ApiUnauthorizedResponse({ description: 'Acesso negado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.postsService.remove(request, +id);
  }
}
