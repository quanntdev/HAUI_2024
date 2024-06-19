import { Module } from '@nestjs/common';
import { CidService } from './cid.service';
import { CidController } from './cid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cid } from '../../entities/cid.entity';
import { Customer } from '../../entities/customer.entity';
import { Country } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Cid, Customer, Country])],
  controllers: [CidController],
  providers: [CidService],
})
export class CidModule {}
