import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceOrderItemsService } from './invoice-order-items.service';

describe('InvoiceOrderItemsService', () => {
  let service: InvoiceOrderItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceOrderItemsService],
    }).compile();

    service = module.get<InvoiceOrderItemsService>(InvoiceOrderItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
