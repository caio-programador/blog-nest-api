import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/services/users.service';
import { JwtStrategy } from './services/jwt.strategy';
import { PostEntity } from '../posts/entities/post.entity';
import { Category } from '../posts/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, PostEntity, Category]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
