import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'E-mail do usuário' })
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'Senha do usuario' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
