import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'O nome do usuário' })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({ description: 'O email do usuário' })
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'A senha do usuário' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
