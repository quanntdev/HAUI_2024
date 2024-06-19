import { Test, TestingModule } from '@nestjs/testing';
import { ChecklistItemController } from './checklist-item.controller';
import { ChecklistItemService } from './checklist-item.service';

describe('ChecklistItemController', () => {
  let controller: ChecklistItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChecklistItemController],
      providers: [ChecklistItemService],
    }).compile();

    controller = module.get<ChecklistItemController>(ChecklistItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
