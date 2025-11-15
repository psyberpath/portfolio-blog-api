import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/entities/user.entity';
import {
  CacheInterceptor,
  CacheKey,
  CACHE_MANAGER,
} from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: { user: User },
  ) {
    const newPost = await this.postsService.create(createPostDto, req.user);
    await this.cacheManager.del('/posts');
    return newPost;
  }

  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @UseInterceptors(CacheInterceptor)
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.postsService.findOne(slug);
  }
}
