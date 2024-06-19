import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/entities';
import { City } from 'src/entities';
import { Customer } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Country, City, Customer])],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
