import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { PostEntity } from '../../posts/entities/post.entity';
import { Repository } from 'typeorm';
import { emit } from 'process';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let postRepository: Repository<PostEntity>;
  let createUserDto: CreateUserDto;
  let newUser: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            preload: jest.fn(),
            existsBy: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PostEntity),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    postRepository = module.get<Repository<PostEntity>>(getRepositoryToken(PostEntity));
    createUserDto = {
        name: 'John Doe',
        email: 'john@gmail.com',
        password: '123456',
      }

    newUser = { id: 1, ...createUserDto };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create a user', () => {
    it('should be able to create a user', async () => {
      jest.spyOn(userRepository, 'existsBy').mockResolvedValue(false);
      jest.spyOn(userRepository, 'create').mockReturnValue(newUser as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue( newUser as any);

      const user = await service.create(createUserDto)
      expect(user.email).toStrictEqual(createUserDto.email);
    })

    it('should throw a conflict exception', async () => {
      jest.spyOn(userRepository, 'existsBy').mockResolvedValue(true);
      jest.spyOn(userRepository, 'create').mockReturnValue(newUser as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue( newUser as any);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException)
    })
  })
  describe('details', () => {
    it('should be able to get user details', async () => {
      jest.spyOn(service, 'getEmailFromToken').mockReturnValue(createUserDto.email);
      jest.spyOn(service, 'findUserByEmail').mockResolvedValue(newUser as any);
      
      const user = await service.details({} as any);
      expect(user.email).toStrictEqual(createUserDto.email);
    })
  })
  describe('update', () => {
    it('should be able to update user details', async () => {
      jest.spyOn(service, 'getEmailFromToken').mockReturnValue(createUserDto.email);
      jest.spyOn(userRepository, 'preload').mockResolvedValue(newUser as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue(newUser as any);

      const user = await service.update({} as any, createUserDto);
      expect(user.email).toStrictEqual(createUserDto.email);
    })
  })

  describe('remove', () => {
    it('should be able to remove a user', async () => {
      jest.spyOn(service, 'getEmailFromToken').mockReturnValue(createUserDto.email);
      jest.spyOn(service, 'findUserByEmail').mockResolvedValue(newUser as any);
      jest.spyOn(userRepository, 'remove').mockResolvedValue({} as any);

      await service.remove({} as any);
      expect(userRepository.remove).toHaveBeenCalled();
    })
  })

  describe('findUserByEmail', () => {
    it('should be able to find a user by email', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(newUser as any);

      const user = await service.findUserByEmail(createUserDto.email);
      expect(user.email).toStrictEqual(createUserDto.email);
    })
  })

  describe('findAll', () => {
    it('should be able to find all users', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([newUser] as any);

      const users = await service.findAll();
      expect(users).toHaveLength(1);
    })
  })

})