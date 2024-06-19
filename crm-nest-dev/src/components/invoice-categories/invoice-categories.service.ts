import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceCategory } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateInvoiceCategoryDto } from './dto/create-invoice-category.dto';
import { UpdateInvoiceCategoryDto } from './dto/update-invoice-category.dto';
import { checkMysqlError } from '../../common/validatorContraints/checkMysqlError';

@Injectable()
export class InvoiceCategoriesService {
  constructor(
    @InjectRepository(InvoiceCategory)
    private readonly invoiceCategoryRepository: Repository<InvoiceCategory>
  ) { }

  create(createInvoiceCategoryDto: CreateInvoiceCategoryDto) { }

  async findAll() {
    try {
      return {
        data: await this.invoiceCategoryRepository.find()
      };
    } catch (e) {
      checkMysqlError(e)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} invoiceCategory`;
  }

  update(id: number, updateInvoiceCategoryDto: UpdateInvoiceCategoryDto) {
    return `This action updates a #${id} invoiceCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoiceCategory`;
  }
}
