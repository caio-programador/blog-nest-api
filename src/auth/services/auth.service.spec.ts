import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../users/entities/role.entity';
import { LoginDto } from '../dto/login.dto';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let loginDto: LoginDto;
  let user: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
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
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return an object with an accessToken property', async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(service, 'createAccessToken').mockResolvedValue('token');
      jest.spyOn(service, 'checkPassword').mockResolvedValue(true);

      const result = await service.login(loginDto);
      expect(result).toHaveProperty('accessToken');
    });

    it('should throw an error if the user does not exist', async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if the password is incorrect', async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(service, 'checkPassword').mockResolvedValue(false);
      await expect(service.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
