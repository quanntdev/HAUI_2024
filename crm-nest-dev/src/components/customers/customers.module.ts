import { InvoicesService } from './../invoices/invoices.service';
import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Cid,
  Country,
  City,
  Industry,
  Tag,
  EmployeeConfig,
  Customer,
  Order,
  Deal,
  Status,
  Contact,
  Category,
  User,
  Currency,
  OrderStatus,
  BillingType,
  OrderItem,
  Invoice,
  LogNote,
  CustomerLevel,
  Notification,
  SaleChannel,
  InvoiceOrderItem,
  InvoiceCategory,
  Payment,
  Partner,
  PartnerCustomer,
  PartnerInvoice,
  Task
} from 'src/entities';
import { OrderService } from '../order/order.service';
import { DealsService } from '../deals/deals.service';
import { ContactService } from '../contacts/contacts.service';
import { LogNotesService } from '../log-notes/log-notes.service';
import { IsNotEmptyValidate } from 'src/common/validatorContraints/customeValidate/isNotEmpty';
import { IsStringValidate } from 'src/common/validatorContraints/customeValidate/isString';
import { IsCiD, IsNumberText } from 'src/common/validatorContraints/isNumberText';
import { CheckURL } from 'src/common/validatorContraints';
import { IsDateStringOrEmpty } from 'src/common/validatorContraints/isDateOrEmptyString';
import { CheckPartnerId } from 'src/common/validatorContraints/validatePartner/checkPartnerId';
import { CheckPartnerType } from 'src/common/validatorContraints/validatePartner/checkPartnerType';
import { CheckPartnerSalePercent } from 'src/common/validatorContraints/validatePartner/checkPartnerSalePercent';
import { CheckPartnerTypePercent } from 'src/common/validatorContraints/validatePartner/checkPartnerTypePercent';
import { CheckFaxPhone } from 'src/common/validatorContraints/customeValidate/checkFaxPhone';
import { PartnerInvoicesService } from '../partner-invoices/partner-invoices.service';
import { CheckEndDate } from 'src/common/validatorContraints/validatePartner/checkEndDate';
import { TasksService } from '../tasks/tasks.service';
import { StripeService } from '../stripe/stripe.service';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      Customer,
      Tag,
      EmployeeConfig,
      Industry,
      Country,
      Cid,
      City,
      Order,
      Deal,
      Status,
      Contact,
      Category,
      User,
      Currency,
      OrderStatus,
      BillingType,
      OrderItem,
      Invoice,
      LogNote,
      CustomerLevel,
      SaleChannel,
      Notification,
      User,
      InvoiceOrderItem,
      InvoiceCategory,
      Payment,
      Partner,
      PartnerCustomer,
      PartnerInvoice
    ]),
  ],
  controllers: [CustomersController],
  providers: [
    CustomersService,
    OrderService,
    DealsService,
    ContactService,
    LogNotesService,
    InvoicesService,
    IsNotEmptyValidate,
    IsStringValidate,
    IsNumberText,
    CheckURL,
    IsDateStringOrEmpty,
    CheckPartnerId,
    CheckPartnerType,
    CheckPartnerSalePercent,
    CheckPartnerTypePercent,
    IsCiD,
    CheckFaxPhone,
    PartnerInvoicesService,
    CheckEndDate,
    TasksService,
    StripeService,
    MailService
  ],
})
export class CustomersModule {}
