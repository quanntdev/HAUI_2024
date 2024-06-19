import { Test, TestingModule } from '@nestjs/testing';
import { LogNotesController } from './log-notes.controller';
import { LogNotesService } from './log-notes.service';

describe('LogNotesController', () => {
  let controller: LogNotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogNotesController],
      providers: [LogNotesService],
    }).compile();

    controller = module.get<LogNotesController>(LogNotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
