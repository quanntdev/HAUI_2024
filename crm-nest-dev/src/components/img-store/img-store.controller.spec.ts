import { Test, TestingModule } from '@nestjs/testing';
import { ImgStoreController } from './img-store.controller';
import { ImgStoreService } from './img-store.service';

describe('ImgStoreController', () => {
  let controller: ImgStoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImgStoreController],
      providers: [ImgStoreService],
    }).compile();

    controller = module.get<ImgStoreController>(ImgStoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
