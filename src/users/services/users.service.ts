import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { verify } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>;

  async create(createUserDto: CreateUserDto): Promise<User> {
    let { password } = createUserDto;

    const userExists = await this.userRepository.existsBy({
      email: createUserDto.email,
    });

    if (userExists)
      throw new ConflictException('User with this email already exists');

    password = await bcrypt.hash(password, 10);
    createUserDto.password = password;
    const role = await this.roleRepository.findOne({ where: { id: 2 } });
    const user = await this.userRepository.create({ ...createUserDto, role });
    return this.userRepository.save(user);
  }

  async details(request: Request): Promise<User> {
    const email = this.getEmailFromToken(request);
    return this.findUserByEmail(email);
  }

  async update(request: Request, updateUserDto: UpdateUserDto) {
    const email = this.getEmailFromToken(request);
    let user = await this.findUserByEmail(email);
    user = await this.userRepository.preload({ ...updateUserDto, id: user.id });
    if (!user) throw new NotFoundException('User with this id does not exists');

    return this.userRepository.save(user);
  }

  async remove(request: Request): Promise<void> {
    const email = this.getEmailFromToken(request);
    const user = await this.findUserByEmail(email);
    await this.userRepository.remove(user);
  }

  public async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role', 'posts'],
    });

    return user;
  }

  public getEmailFromToken(request: Request): string {
    const [, token] = request.headers.authorization.split(' ');
    try {
      const payload = verify(token, process.env.JWT_SECRET);
      return payload['email'];
    } catch (error) {
      throw new HttpException(`An unexpected Error - ${error}`, 500);
    }
  }

  findAll(): User[] | Promise<User[]> {
    return this.userRepository.find({
      relations: ['role', 'posts', 'posts.categories'],
    });
  }
}
