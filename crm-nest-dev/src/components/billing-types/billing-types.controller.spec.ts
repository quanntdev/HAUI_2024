import { Test, TestingModule } from '@nestjs/testing';
import { BillingTypesController } from './billing-types.controller';
import { BillingTypesService } from './billing-types.service';

describe('BillingTypesController', () => {
  let controller: BillingTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingTypesController],
      providers: [BillingTypesService],
    }).compile();

    controller = module.get<BillingTypesController>(BillingTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
