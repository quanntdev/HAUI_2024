import { Test, TestingModule } from '@nestjs/testing';
import { employeeServices } from './employee.service';

describe('employeeServices', () => {
  let service: employeeServices;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [employeeServices],
    }).compile();

    service = module.get<employeeServices>(employeeServices);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
