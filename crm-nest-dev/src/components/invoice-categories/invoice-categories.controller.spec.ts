import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceCategoriesController } from './invoice-categories.controller';
import { InvoiceCategoriesService } from './invoice-categories.service';

describe('InvoiceCategoriesController', () => {
  let controller: InvoiceCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceCategoriesController],
      providers: [InvoiceCategoriesService],
    }).compile();

    controller = module.get<InvoiceCategoriesController>(InvoiceCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
