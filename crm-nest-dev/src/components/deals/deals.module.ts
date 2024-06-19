import { Module } from '@nestjs/common';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deal } from '../../entities/deal.entity';
import { Customer } from '../../entities/customer.entity';
import { Contact } from '../../entities/contact.entity';
import { Category } from '../../entities/category.entity';
import { User } from '../../entities/user.entity';
import { Currency } from '../../entities/currency.entity';
import { Status } from '../../entities/status.entity';
import { Tag } from '../../entities/tag.entity';
import { Order, BillingType, OrderItem, OrderStatus, Invoice, LogNote, Partner, PartnerCustomer, Profile, Notification } from 'src/entities';
import { OrderService } from '../order/order.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { IsNotEmptyValidate } from 'src/common/validatorContraints/customeValidate/isNotEmpty';
import { IsStringValidate } from 'src/common/validatorContraints/customeValidate/isString';
import { IsNumberText } from 'src/common/validatorContraints/isNumberText';
import { CheckURL, IsDateString } from 'src/common/validatorContraints';
import { IsDateStringOrEmpty } from 'src/common/validatorContraints/isDateOrEmptyString';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Status,
      Deal,
      Customer,
      Contact,
      Category,
      User,
      Currency,
      Tag,
      Order,
      OrderStatus,
      BillingType,
      OrderItem,
      Invoice,
      LogNote,
      Notification,
      Partner,
      PartnerCustomer,
      Profile
    ]),
  ],
  controllers: [DealsController],
  providers: [DealsService, OrderService, CreateDealDto, IsNotEmptyValidate, IsStringValidate, IsNumberText, CheckURL, IsDateStringOrEmpty, IsDateString],
})
export class DealsModule {}
