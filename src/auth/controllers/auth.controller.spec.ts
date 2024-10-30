import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../users/entities/role.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let usersService: UsersService;
  let loginDto: LoginDto;
  let user: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UsersService,
        AuthService,
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
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);

    user = {
      id: 1,
      email: 'john@gmail.com',
      password: '123456',
      role: {
        id: 1,
        name: 'user',
      },
    };
    loginDto = { email: 'john@gmail', password: '123456' };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a token', async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(service, 'createAccessToken').mockResolvedValue('token');
      jest.spyOn(service, 'checkPassword').mockResolvedValue(true);

      const result = await controller.login(loginDto);
      expect(result).toHaveProperty('accessToken');
    });
    it('should return an error if the user is not found', async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if the password is incorrect', async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(service, 'checkPassword').mockResolvedValue(false);
      await expect(controller.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
