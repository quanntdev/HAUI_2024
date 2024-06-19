import { Test, TestingModule } from '@nestjs/testing';
import { CidService } from './cid.service';

describe('CidService', () => {
  let service: CidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CidService],
    }).compile();

    service = module.get<CidService>(CidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
