import { Test, TestingModule } from '@nestjs/testing';
import { LogNotesService } from './log-notes.service';

describe('LogNotesService', () => {
  let service: LogNotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogNotesService],
    }).compile();

    service = module.get<LogNotesService>(LogNotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
