import { Test, TestingModule } from '@nestjs/testing';
import { CustomerLevelService } from './customer-level.service';

describe('CustomerLevelService', () => {
  let service: CustomerLevelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerLevelService],
    }).compile();

    service = module.get<CustomerLevelService>(CustomerLevelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
