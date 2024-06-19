import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/entities';
import { City } from 'src/entities';
import { Customer } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([City, Country, Customer])],
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CitiesModule {}
