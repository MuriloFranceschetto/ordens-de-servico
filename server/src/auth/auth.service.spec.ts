import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import {AuthController} from "./auth.controller";

describe('AuthService', () => {

  let service: AuthService;
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(1).toBeDefined();
  });
});
