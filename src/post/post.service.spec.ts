import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { JwtModule } from '@nestjs/jwt';

const createPostModelMock = {
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  exec: jest.fn(),
  save: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}

describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'JWT_SECRET',
          signOptions: { expiresIn: '15m' },
        }),
      ],
      providers: [
        PostService,
        {
          provide: getModelToken(Post.name),
          useValue: createPostModelMock,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
