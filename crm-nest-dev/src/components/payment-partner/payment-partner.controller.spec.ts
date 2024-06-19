import { Test, TestingModule } from '@nestjs/testing';
import { PaymentPartnerController } from './payment-partner.controller';

describe('PaymentPartnerController', () => {
  let controller: PaymentPartnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentPartnerController],
    }).compile();

    controller = module.get<PaymentPartnerController>(PaymentPartnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
