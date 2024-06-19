import { Test, TestingModule } from '@nestjs/testing';
import { SaleChannelService } from './sale-channel.service';

describe('CountriesService', () => {
  let service: SaleChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaleChannelService],
    }).compile();

    service = module.get<SaleChannelService>(SaleChannelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
