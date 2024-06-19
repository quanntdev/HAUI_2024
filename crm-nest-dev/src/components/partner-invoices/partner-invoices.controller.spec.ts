import { Test, TestingModule } from '@nestjs/testing';
import { PartnerInvoicesController } from './partner-invoices.controller';

describe('PartnerInvoicesController', () => {
  let controller: PartnerInvoicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerInvoicesController],
    }).compile();

    controller = module.get<PartnerInvoicesController>(PartnerInvoicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
