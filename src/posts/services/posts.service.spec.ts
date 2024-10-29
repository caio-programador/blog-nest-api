import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { UsersService } from '../../users/services/users.service';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../users/entities/role.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let usersService: UsersService;
  let postRepository: Repository<PostEntity>
  let categoryRepository: Repository<Category>
  let userRepository: Repository<User>
  let roleRepository: Repository<Role>
  let post: CreatePostDto
  let user: any
  let bigPost: any
    
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        UsersService,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          }
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          }
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            existsBy: jest.fn(),
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

    service = module.get<PostsService>(PostsService);
    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    postRepository = module.get<Repository<PostEntity>>(getRepositoryToken(PostEntity));
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
    
    post = {
      title: 'Post title',
      description: 'Post content',
      categories: [
        'category1',
        'category2'
      ]
    }

    

    user = {
      id: 1,
      email: 'john@gmail.com'
    }

    bigPost = {
      id: 1,
      ...post,
      user: user
    }

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a post', async () => {
      jest.spyOn(usersService, 'getEmailFromToken').mockReturnValue(user.email);
      jest.spyOn(postRepository, 'create').mockReturnValue(bigPost as any);
      jest.spyOn(postRepository, 'save').mockReturnValue(bigPost as any);
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(user);

      const newPost = await service.create({} as any, post);

      expect(newPost.title).toEqual(post.title);
      expect(newPost.categories).toEqual(post.categories);
    });
  })

  describe('finds', () => {
    it('should find all posts', async () => {
      jest.spyOn(postRepository, 'find').mockResolvedValue([bigPost] as any);

      const posts = await service.findAll();

      expect(posts).toEqual([bigPost]);
    })

    it('should find a post by id', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(bigPost as any);

      const post = await service.findOne(1);

      expect(post).toEqual(bigPost);
    })

    it('should throw Not Found Exception', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  })

  describe('update', () => {
    it('should update a post', async () => {
      jest.spyOn(usersService, 'getEmailFromToken').mockReturnValue(user.email);
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(bigPost as any);
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(postRepository, 'preload').mockResolvedValue(bigPost as any);
      jest.spyOn(postRepository, 'save').mockResolvedValue(bigPost as any);

      const updatedPost = await service.update({} as any, 1, post);

      expect(updatedPost.title).toEqual(post.title);
      expect(updatedPost.categories).toEqual(post.categories);
    })

    it('should throw Not Found Exception', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update({} as any, 1, post)).rejects.toThrow(NotFoundException);
    });

    it('should throw Forbidden Exception', async () => {
      jest.spyOn(usersService, 'getEmailFromToken').mockReturnValue('pedro@gmail.com');
      jest.spyOn(usersService, 'findUserByEmail')
        .mockResolvedValue({ id: 2, email: 'pedro@gmail.com' } as any);
      
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(bigPost as any);
      jest.spyOn(postRepository, 'preload').mockResolvedValue(bigPost as any);
      jest.spyOn(postRepository, 'save').mockResolvedValue(bigPost as any);

      await expect(service.update({} as any, 1, post))
        .rejects.toThrow(ForbiddenException);
    });
  })


  describe('delete', () => {
    it('should remove a post', async () => {
      jest.spyOn(usersService, 'getEmailFromToken').mockReturnValue(user.email);
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(bigPost as any);
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(postRepository, 'remove').mockResolvedValue({} as any);

      await service.remove({} as any, 1);
      expect(postRepository.remove).toHaveBeenCalled();
    })

    it('should throw Not Found Exception', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove({} as any, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw Forbidden Exception', async () => {
      jest.spyOn(usersService, 'getEmailFromToken').mockReturnValue('pedro@gmail.com');
      jest.spyOn(usersService, 'findUserByEmail')
        .mockResolvedValue({ id: 2, email: 'pedro@gmail.com' } as any);
      
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(bigPost as any);
      jest.spyOn(postRepository, 'remove').mockResolvedValue({} as any);

      await expect(service.remove({} as any, 1))
        .rejects.toThrow(ForbiddenException);
    });
  })
})
