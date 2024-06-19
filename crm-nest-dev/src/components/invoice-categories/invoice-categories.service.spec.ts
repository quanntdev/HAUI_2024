import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceCategoriesService } from './invoice-categories.service';

describe('InvoiceCategoriesService', () => {
  let service: InvoiceCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceCategoriesService],
    }).compile();

    service = module.get<InvoiceCategoriesService>(InvoiceCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
