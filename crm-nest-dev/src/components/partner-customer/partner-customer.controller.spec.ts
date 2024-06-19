import { Test, TestingModule } from '@nestjs/testing';
import { PartnerCustomerController } from './partner-customer.controller';

describe('PartnerCustomerController', () => {
  let controller: PartnerCustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerCustomerController],
    }).compile();

    controller = module.get<PartnerCustomerController>(PartnerCustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
