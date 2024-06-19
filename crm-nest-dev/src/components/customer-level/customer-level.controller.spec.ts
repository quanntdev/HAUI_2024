import { Test, TestingModule } from '@nestjs/testing';
import { CustomerLevelController } from './customer-level.controller';
import { CustomerLevelService } from './customer-level.service';

describe('CustomerLevelController', () => {
  let controller: CustomerLevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerLevelController],
      providers: [CustomerLevelService],
    }).compile();

    controller = module.get<CustomerLevelController>(CustomerLevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
