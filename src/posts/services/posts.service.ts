import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { UsersService } from 'src/users/services/users.service';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { PostResponse } from '../dto/post-response.dto';
import { parseToDto } from '../utils/parse-to-dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>
  ) { }

  async create(request: Request, createPostDto: CreatePostDto): Promise<PostResponse> {
    const email = this.usersService.getEmailFromToken(request)
    const user = await this.usersService.findUserByEmail(email)
    const post = await this.postRepository.create({ ...createPostDto, user })
    await this.postRepository.save(post)

    return parseToDto(post)
  }

  async findAll(): Promise<PostResponse[]>{
    const posts = await this.postRepository.find({relations: ['user'],})

    return posts.map(post => parseToDto(post))
  }

  async findOne(id: number): Promise<PostResponse> {
    const post = await this.findById(id)
    return parseToDto(post)
  }

  async update(request: Request, id: number, updatePostDto: UpdatePostDto) {
    let post = await this.findById(id)
    const email = this.usersService.getEmailFromToken(request)
    const user = await this.usersService.findUserByEmail(email)

    if (post.user.id !== user.id) {
      throw new ForbiddenException('You are not authorized to do that')
    }
    post = await this.postRepository.preload({ ...updatePostDto, id:post.id })
    await this.postRepository.save(post)
    post.user = user
    return parseToDto(post)
  }

  async remove(request: Request, id: number): Promise<void> {
    const post = await this.findById(id)
    const email = this.usersService.getEmailFromToken(request)
    const user = await this.usersService.findUserByEmail(email)

    if (post.user.id !== user.id) {
      throw new ForbiddenException('You are not authorized to do that')
    }

    await this.postRepository.remove(post)
  }

  private async findById(id: number): Promise<PostEntity> {
    const post = await this.postRepository.findOne({ where: { id }, relations: ['user'] })
    if (!post) {
      throw new NotFoundException('Post not found')
    }
    return post
  }
}
