import { Test, TestingModule } from '@nestjs/testing';
import { ImgStoreService } from './img-store.service';

describe('ImgStoreService', () => {
  let service: ImgStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImgStoreService],
    }).compile();

    service = module.get<ImgStoreService>(ImgStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
