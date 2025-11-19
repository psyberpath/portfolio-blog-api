import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  private async checkPostOwnership(
    postId: string,
    userId: string,
    operation: 'update' | 'delete',
  ) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ${postId} not found.`);
    }
    if (post.author.id !== userId) {
      throw new ForbiddenException(
        `You are not authorized to ${operation} this post.`,
      );
    }
    return post;
  }

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

  async update(
    postId: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<Post> {
    const postToUpdate = await this.checkPostOwnership(
      postId,
      userId,
      'update',
    );
    const calculatedSlug = updatePostDto.title
      ? updatePostDto.title.toLowerCase().split(' ').join('-')
      : postToUpdate.slug;
    const updates = {
      ...updatePostDto,
      slug: calculatedSlug,
    };
    const updatedPost = this.postsRepository.merge(postToUpdate, updates);
    return this.postsRepository.save(updatedPost);
  }

  async remove(postId: string, userId: string): Promise<void> {
    const postToDelete = await this.checkPostOwnership(
      postId,
      userId,
      'delete',
    );
    await this.postsRepository.remove(postToDelete);
  }
}
