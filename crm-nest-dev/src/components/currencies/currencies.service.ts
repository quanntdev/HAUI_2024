import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from 'src/entities';
import { Repository } from 'typeorm';
import { AxiosService } from '../axios-http/axios.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import config from 'src/config';
import { BASE_CURRENCY } from 'src/constants';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,

    private readonly axiosService : AxiosService
  ) {}
  // create(createCurrencyDto: CreateCurrencyDto) {
  //   return 'This action adds a new currency';
  // }

  async findAll() {
    return {
      data: await this.currencyRepository.find(),
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: 'updateCurrencyData',
    timeZone: config.TIME_ZONE ?? 'Asia/Ho_Chi_Minh',
  })
  async updateCurrencyData(handlebyRequest: boolean) {

    const currency = await this.currencyRepository.find()

    const transCurrency = currency.reduce((acc, item) => {
      if (item.default !== true) {
        acc.push(item.name);
      }
      return acc;
    }, []);

    const baseCurreny = currency.filter(item => item.default)

    const data = await this.axiosService.get(BASE_CURRENCY, {
      params :{
        apikey: config.APILAYER_CURRENCY_KEY,
        currencies: transCurrency.join(","),
        base_currency: baseCurreny[0].name
      }
    })

      const result = currency.map(curr => {
        const code = curr.name;
        const value = data.data[code]?.value || "0.00";
        return { ...curr, exchange_rate: value };
      });


    await this.currencyRepository.save(result)

    if (handlebyRequest) {
      return { data: [] };
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} currency`;
  // }

  // update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
  //   return `This action updates a #${id} currency`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} currency`;
  // }
}
