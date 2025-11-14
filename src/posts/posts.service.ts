import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, author: User): Promise<Post> {
    const { title } = createPostDto;
    const generatedSlug = title.toLowerCase().split(' ').join('-');
    const newPost = this.postsRepository.create({
      ...createPostDto,
      slug: generatedSlug,
      author: author,
    });
    return this.postsRepository.save(newPost);
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  async findOne(slug: string): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ slug });
    if (!post) throw new NotFoundException(`Post with slug ${slug} not found`);
    return post;
  }
}
