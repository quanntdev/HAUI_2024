import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillingType } from 'src/entities';

@Injectable()
export class BillingTypesService {
  constructor(
    @InjectRepository(BillingType)
    private readonly billingTypesRepository: Repository<BillingType>,
  ) {}

  async findAll() {
    return {
      data: await this.billingTypesRepository.find(),
    };
  }
}
