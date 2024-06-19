import { Injectable } from '@nestjs/common';
import { PaymentMethod } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  async findAll() {
    try {
      return {
        data: await this.paymentMethodRepository.find(),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }
}
