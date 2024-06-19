import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceOrderItemsController } from './invoice-order-items.controller';
import { InvoiceOrderItemsService } from './invoice-order-items.service';

describe('InvoiceOrderItemsController', () => {
  let controller: InvoiceOrderItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceOrderItemsController],
      providers: [InvoiceOrderItemsService],
    }).compile();

    controller = module.get<InvoiceOrderItemsController>(InvoiceOrderItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
