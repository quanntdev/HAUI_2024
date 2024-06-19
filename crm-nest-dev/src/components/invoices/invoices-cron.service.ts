import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import config from '../../config';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';
import { Invoice } from 'src/entities';
import { Repository } from 'typeorm';
import { InvoiceStatusEnum } from './enum/invoice-status.enum';

@Injectable()
export class CronInvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: 'updateStatusInvoice',
    timeZone: config.TIME_ZONE ?? 'Asia/Ho_Chi_Minh',
  })
  async updateStatusInvoiceCronJob(handlebyRequest: boolean) {
    const invoices = await this.invoiceRepository.find({
      where: {
        status: InvoiceStatusEnum.Request_Sending,
      },
    });
    const overDueInvoices = invoices.filter((invoice) => {
      if (invoice.due_date) {
        return new Date(invoice.due_date).getTime() < Date.now();
      }
    });
    try {
      await Promise.all(
        overDueInvoices.map((invoice) =>
          this.invoiceRepository.update(+invoice.id, {
            ...invoice,
            status: InvoiceStatusEnum.Over_Due,
          }),
        ),
      );
      if (handlebyRequest) {
        return {
          data: [],
        };
      }
    } catch (e) {
      checkMysqlError(e);
    }
  }
}
