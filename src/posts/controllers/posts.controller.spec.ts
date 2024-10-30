import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from '../services/posts.service';
import { UsersService } from '../../users/services/users.service';
import { PostEntity } from '../entities/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../users/entities/role.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { NotFoundException } from '@nestjs/common';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;
  let usersService: UsersService;
  let createPostDto: CreatePostDto;
  let newPost: any;
  let user: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        PostsService,
        UsersService,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
    usersService = module.get<UsersService>(UsersService);

    createPostDto = {
      title: 'Post title',
      description: 'Post content',
      categories: ['Category 1', 'Category 2'],
    };
    user = {
      id: 1,
      name: 'John Doe',
      email: 'john@gmail.com',
      password: '123456',
      role: {
        id: 1,
        name: 'User',
      },
    };
    newPost = {
      id: 1,
      ...createPostDto,
      user: user,
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(service, 'create').mockResolvedValue(newPost as any);

      const post = await controller.create({} as any, createPostDto);

      expect(post.title).toStrictEqual(createPostDto.title);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe('finds', () => {
    it('should return all posts', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([newPost] as any);

      const posts = await controller.findAll();

      expect(posts).toStrictEqual([newPost]);
      expect(service.findAll).toHaveBeenCalled();
    });
    it('should return a post', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(newPost as any);

      const post = await controller.findOne('1');

      expect(post).toStrictEqual(newPost);
      expect(service.findOne).toHaveBeenCalled();
    });
    it('should throw a not found exception', async () => {
      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(service, 'update').mockResolvedValue(newPost as any);

      const post = await controller.update({} as any, '1', createPostDto);

      expect(post).toStrictEqual(newPost);
      expect(service.update).toHaveBeenCalled();
    });
    it('should throw a not found exception', async () => {
      await expect(
        controller.update({} as any, '1', createPostDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('remove', () => {
    it('should remove a post', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove({} as any, '1');

      expect(service.remove).toHaveBeenCalled();
    });
    it('should throw a not found exception', async () => {
      await expect(controller.remove({} as any, '1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
