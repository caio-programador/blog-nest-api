import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Request } from 'express';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) { }
  

  async create(createUserDto: CreateUserDto) {
    let { password } = createUserDto

    const userExists = await this.userRepository.existsBy(
      { email: createUserDto.email })
    
    if (userExists)
      throw new ConflictException('User with this email already exists')



    password = await bcrypt.hash(password, 10)
    createUserDto.password = password
    const role = await this.roleRepository.findOne({where: {id: 2}})
    const user = await this.userRepository.create({ ...createUserDto, role })
    return this.userRepository.save(user)
  }

  async details(request: Request) {
  }

  async update(request: Request, updateUserDto: UpdateUserDto) {
  }

  async remove(request: Request) {
  }

  public async validateUser(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } })
    
    if (!user)
      throw new UnauthorizedException('User not found. Invalid Token')
  
    return user
  }


}
