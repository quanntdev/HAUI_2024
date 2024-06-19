import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceAttachmentsService } from './invoice-attachments.service';

describe('InvoiceAttachmentsService', () => {
  let service: InvoiceAttachmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceAttachmentsService],
    }).compile();

    service = module.get<InvoiceAttachmentsService>(InvoiceAttachmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
