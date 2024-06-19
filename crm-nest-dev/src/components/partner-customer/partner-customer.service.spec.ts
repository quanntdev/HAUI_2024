import { Test, TestingModule } from '@nestjs/testing';
import { PartnerCustomerService } from './partner-customer.service';

describe('PartnerCustomerService', () => {
  let service: PartnerCustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerCustomerService],
    }).compile();

    service = module.get<PartnerCustomerService>(PartnerCustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
