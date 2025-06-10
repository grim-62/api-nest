import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { AuthGuard } from '../guard/auth.guard'; // Adjust path as necessary
import { JwtService } from '@nestjs/jwt'; // Nest expects this by class

// Mock factory for Mongoose model
const createPostModelMock = () => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  exec: jest.fn(),
  save: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
});

describe('PostController', () => {
  let controller: PostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        PostService,
        {
          provide: getModelToken(Post.name),
          useValue: createPostModelMock(),
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideProvider(JwtService)
      .useValue({
        signAsync: jest.fn(),
        verifyAsync: jest.fn(),
      }) 
      .compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
