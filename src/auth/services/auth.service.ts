import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import { sign } from 'jsonwebtoken';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findUserByEmail(loginDto.email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const match = await this.checkPassword(loginDto.password, user);

    if (!match) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwtToken = await this.createAccessToken(
      user.id,
      user.role.id,
      user.email,
    );
    return { accessToken: jwtToken };
  }

  public async createAccessToken(
    userId: number,
    roleId: number,
    email: string,
  ): Promise<string> {
    return sign({ userId, roleId, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  private static jwtExtractor(request: Request): string {
    const bearerToken = request.headers.authorization;
    if (!bearerToken) {
      throw new UnauthorizedException('You do not have access to do this');
    }
    const [, token] = bearerToken.split(' ');

    return token;
  }
  public returnJwtExtractor(): (request: Request) => string {
    return AuthService.jwtExtractor;
  }

  private async checkPassword(password: string, user: User): Promise<boolean> {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new BadRequestException('Wrong password');
    }
    return match;
  }
}
