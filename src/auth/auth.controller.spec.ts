import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';

import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';

const userModelMock = {
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  TryCatch : jest.fn()
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[JwtModule.register({
        secret: "JWT_SECRET",
        signOptions: { expiresIn: '15m' },
      })],
      controllers: [AuthController],
      providers: [AuthService,{
        provide:getModelToken(User.name),
        useValue: userModelMock,
      }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  
});
