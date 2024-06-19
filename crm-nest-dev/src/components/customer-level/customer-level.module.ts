import { Module } from '@nestjs/common';
import { CustomerLevelService } from './customer-level.service';
import { CustomerLevelController } from './customer-level.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer, CustomerLevel } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerLevel,Customer])],
  controllers: [CustomerLevelController],
  providers: [CustomerLevelService],
})
export class CustomerLevelModule {}
