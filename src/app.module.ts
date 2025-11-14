import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [AuthModule, UsersModule, PostsModule, CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
