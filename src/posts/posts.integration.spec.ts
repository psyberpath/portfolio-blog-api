import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { PostsModule } from './posts.module';
import { UsersModule } from 'src/users/users.module';
import { PostsService } from './posts.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Post } from './entities/post.entity';
import { App } from 'supertest/types';

describe('PostsIntegration', () => {
  let app: INestApplication<App>;
  let postsService: PostsService;
  let usersService: UsersService;
  let postsRepository: Repository<Post>;
  let usersRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, PostsModule, UsersModule],
    }).compile();
    postsService = module.get<PostsService>(PostsService);
    usersService = module.get<UsersService>(UsersService);
    postsRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await postsRepository.createQueryBuilder().delete().execute();
    await usersRepository.createQueryBuilder().delete().execute();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a post and save it to the database', async () => {
    const user = await usersService.create({
      email: 'test@user.com',
      password: 'password123',
    });

    const postDto = {
      title: 'test post',
      content: 'lorem ipsum and some tintinnabulating abuela',
    };

    const createdPost = await postsService.create(postDto, user);

    const dbPost = await postsRepository.findOneBy({ id: createdPost.id });
    expect(dbPost).toBeDefined();
    expect(dbPost?.title).toEqual(postDto.title);
    expect(dbPost?.slug).toEqual('test-post');

    const dbPostWithAuthor = await postsRepository.findOne({
      where: { id: createdPost.id },
      relations: ['author'],
    });
    expect(dbPostWithAuthor?.author.email).toEqual('test@user.com');
  });
});
