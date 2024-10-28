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
import { Category } from '../entities/category.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) { }

  async create(request: Request, createPostDto: CreatePostDto): Promise<PostResponse> {
    const email = this.usersService.getEmailFromToken(request)
    const user = await this.usersService.findUserByEmail(email)
    const categories = await Promise.all(
      createPostDto.categories.map(category =>
        this.findCategoryByName(category)))

    const post = await this.postRepository
      .create({ ...createPostDto, user, categories })
    await this.postRepository.save(post)

    return parseToDto(post)
  }

  async findAll(): Promise<PostResponse[]>{
    const posts = await this.postRepository.find({relations: ['user', 'categories'],})
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

    const categories = updatePostDto.categories &&
      await Promise.all(updatePostDto.categories.map(category =>
        this.findCategoryByName(category)))

    if (post.user.id !== user.id) {
      throw new ForbiddenException('You are not authorized to do that')
    }
    post = await this.postRepository.preload({ ...updatePostDto, id:post.id, categories })
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
    const post = await this.postRepository.findOne({
      where: { id }, relations:
        ['user', 'categories']
    })
    if (!post) {
      throw new NotFoundException('Post not found')
    }
    return post
  }

  private async findCategoryByName(name: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { name } })
    if (!category) 
      return this.categoryRepository.create({ name })
    
    return category
  }
}
