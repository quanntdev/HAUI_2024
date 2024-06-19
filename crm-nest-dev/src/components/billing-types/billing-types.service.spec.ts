import { Test, TestingModule } from '@nestjs/testing';
import { BillingTypesService } from './billing-types.service';

describe('BillingTypesService', () => {
  let service: BillingTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillingTypesService],
    }).compile();

    service = module.get<BillingTypesService>(BillingTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
