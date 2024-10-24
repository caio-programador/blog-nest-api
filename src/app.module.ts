import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthService } from './auth/auth.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal:true }), UsersModule, PostsModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
