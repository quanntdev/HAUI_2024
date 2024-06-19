import { System } from './../../entities/system.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';

@Module({
  imports: [TypeOrmModule.forFeature([System])],
  controllers: [SystemController],
  providers: [SystemService]
})
export class SystemModule {}
