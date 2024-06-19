import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  controllers: [StatusController],
  providers: [StatusService]
})
export class StatusModule { }
