import { Test, TestingModule } from '@nestjs/testing';
import { PartnerInvoicesService } from './partner-invoices.service';

describe('PartnerInvoicesService', () => {
  let service: PartnerInvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerInvoicesService],
    }).compile();

    service = module.get<PartnerInvoicesService>(PartnerInvoicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
