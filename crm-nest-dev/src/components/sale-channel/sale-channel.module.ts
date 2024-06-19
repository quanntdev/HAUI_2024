import { Module } from '@nestjs/common';
import { SaleChannelService } from './sale-channel.service';
import { SaleChannelController } from './sale-channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleChannel } from 'src/entities';


@Module({
  imports: [TypeOrmModule.forFeature([SaleChannel])],
  controllers: [SaleChannelController],
  providers: [SaleChannelService],
})
export class SaleChannelModule {}
