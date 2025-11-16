import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';

type MockRepository = {
  find: jest.Mock;
};

const mockPostsRepository: MockRepository = {
  find: jest.fn(),
};

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: mockPostsRepository },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const mockPostsFlow = [
        {
          title: 'post one',
          content: 'content for post one',
        },
        {
          title: 'post two',
          content: 'content for post two',
        },
        {
          title: 'post three',
          content: 'content for post three',
        },
      ];
      mockPostsRepository.find.mockResolvedValue(mockPostsFlow);
      const result = await service.findAll();
      expect(result).toEqual(mockPostsFlow);
    });
  });
});
