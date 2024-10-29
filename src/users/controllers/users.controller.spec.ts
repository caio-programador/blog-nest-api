import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConflictException } from '@nestjs/common';
describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let createUserDto: CreateUserDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            existsBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));

    createUserDto = {
      name: 'John Doe',
      email: 'john@gmail.com',
      password: '123456',
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      jest.spyOn(usersService, 'create').mockResolvedValue(createUserDto as any);

      const user = await controller.create(createUserDto);

      expect(user.email).toStrictEqual(createUserDto.email);
      expect(usersService.create).toHaveBeenCalled();
    });

    it('should throw a conflict exception', async () => {
      jest.spyOn(userRepository, 'existsBy').mockResolvedValue(true);

      await expect(controller.create(createUserDto))
        .rejects.toThrow(ConflictException);
    });
  });
  describe('details', () => { 
    it('should return information about an user', async () => {
      jest.spyOn(usersService, 'details').mockResolvedValue(createUserDto as any);

      const result = await controller.details({} as any);

      expect(result).toBe(createUserDto as any);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      jest.spyOn(usersService, 'update').mockResolvedValue(createUserDto as any);

      const result = await controller.update({} as any, createUserDto);

      expect(result).toBe(createUserDto as any);
    })
  });

  describe('remove', () => {
    it('should remove an user', async () => {
      jest.spyOn(usersService, 'remove').mockResolvedValue(undefined);

      await controller.remove({} as any);

      expect(usersService.remove).toHaveBeenCalled();
    })
  })

  describe('findAll', () => { 
    it('should return all users', async () => {
      jest.spyOn(usersService, 'findAll').mockResolvedValue([createUserDto] as any);

      const result = await controller.findAll();

      expect(result).toStrictEqual([createUserDto] as any);
    });
  })
});
