import { Test, TestingModule } from '@nestjs/testing';
import { PaymentPartnerService } from './payment-partner.service';

describe('PaymentPartnerService', () => {
  let service: PaymentPartnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentPartnerService],
    }).compile();

    service = module.get<PaymentPartnerService>(PaymentPartnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
