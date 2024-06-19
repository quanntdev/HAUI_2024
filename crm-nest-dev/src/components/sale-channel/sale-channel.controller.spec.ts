import { Test, TestingModule } from '@nestjs/testing';
import { SaleChannelController } from './sale-channel.controller';
import { SaleChannelService } from './sale-channel.service';

describe('CountriesController', () => {
  let controller: SaleChannelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleChannelController],
      providers: [SaleChannelService],
    }).compile();

    controller = module.get<SaleChannelController>(SaleChannelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
