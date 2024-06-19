import {HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from 'src/entities';
import { AxiosService } from '../axios-http/axios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Currency]), HttpModule],
  controllers: [CurrenciesController],
  providers: [CurrenciesService, AxiosService]
})
export class CurrenciesModule { }
