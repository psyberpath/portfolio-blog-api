import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

type MockRepository = {
  find: jest.Mock;
  findOneBy: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
};

const mockPostsRepository: MockRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
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
      const mockAllPosts = [
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
      mockPostsRepository.find.mockResolvedValue(mockAllPosts);
      const result = await service.findAll();
      expect(result).toEqual(mockAllPosts);
    });
  });

  describe('findOne', () => {
    it('should find one post by slug', async () => {
      const mockOnePost = {
        title: 'find one post test',
        content: 'content of post to be found',
      };
      mockPostsRepository.findOneBy.mockResolvedValue(mockOnePost);
      const result = await service.findOne('some-slug');
      expect(result).toBe(mockOnePost);
    });
    it('should throw a NotFoundException if post is not found', async () => {
      mockPostsRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('bad-slug')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a new post', async () => {
      const mockDto = {
        title: 'mock post title',
        content: 'mock post content',
      };
      const mockUser = { id: 'some-id-string' } as User;
      const createdPostObject = {
        title: 'mock post title',
        content: 'mock post content',
        slug: 'mock-post-title',
        author: 'some-author',
      };
      const savedPost = {
        ...createdPostObject,
        id: 'some-post-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPostsRepository.create.mockReturnValue(createdPostObject);
      mockPostsRepository.save.mockResolvedValue(savedPost);
      const result = await service.create(mockDto, mockUser);
      expect(mockPostsRepository.create).toHaveBeenCalledWith({
        ...mockDto,
        slug: 'mock-post-title',
        author: mockUser,
      });
      expect(mockPostsRepository.save).toHaveBeenCalledWith(createdPostObject);
      expect(result).toEqual(savedPost);
    });
  });
});
