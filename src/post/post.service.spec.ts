import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';

describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService,
        {
          provide: getModelToken(Post.name),
          useValue: {
            find: jest.fn().mockReturnValue([]),
            findById: jest.fn().mockReturnValue(null),
            findByIdAndUpdate: jest.fn().mockReturnValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
