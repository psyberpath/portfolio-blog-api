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
  Patch,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/entities/user.entity';
import {
  CacheInterceptor,
  // CacheKey,
  CACHE_MANAGER,
} from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { UpdatePostDto } from './dto/update-post.dto';

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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: { user: User },
  ) {
    return this.postsService.update(id, updatePostDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: { user: User }) {
    return this.postsService.remove(id, req.user.id);
  }
}
