import { Module } from '@nestjs/common';
import { IndustriesService } from './industries.service';
import { IndustriesController } from './industries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Industry } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Industry])],
  controllers: [IndustriesController],
  providers: [IndustriesService]
})
export class IndustriesModule { }
