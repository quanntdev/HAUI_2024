import { Test, TestingModule } from '@nestjs/testing';
import { CidController } from './cid.controller';
import { CidService } from './cid.service';

describe('CidController', () => {
  let controller: CidController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CidController],
      providers: [CidService],
    }).compile();

    controller = module.get<CidController>(CidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
