import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceAttachmentsController } from './invoice-attachments.controller';
import { InvoiceAttachmentsService } from './invoice-attachments.service';

describe('InvoiceAttachmentsController', () => {
  let controller: InvoiceAttachmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceAttachmentsController],
      providers: [InvoiceAttachmentsService],
    }).compile();

    controller = module.get<InvoiceAttachmentsController>(InvoiceAttachmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
