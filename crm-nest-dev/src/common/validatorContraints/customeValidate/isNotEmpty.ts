import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { LIST_TRANFORMS } from './const';

@ValidatorConstraint({ name: 'IsNotEmptyValidate', async: false })
@Injectable()
export class IsNotEmptyValidate implements ValidatorConstraintInterface {
  constructor(
    @Inject(I18nService) private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    if (value === 0) {
      return true;
    }
    if (!value || value === '') {
      return false;
    }
    return true;
  }

  private transformDefautName = (value: any, validationArguments: any) => {
    const targetName = validationArguments?.targetName;

    const mapping = {
      name: {
        CreateDealDto: 'deal_name',
        CreateCustomerDto: 'customer_name',
        CreateOrderDto: 'orderId',
        CreateTaskDto: 'task',
        CreateCustomerLevelDto: 'level_customer',
        CreatePartnerDto:'sale_partner',
        CreateIndustryDto:'industry_name'
      },
      methodId: {
        CreatePaymentDto: 'methodId',
      },
      amount: {
        CreatePaymentDto: 'amount',
      },
      description: {
        CreateCustomerLevelDto: 'description',
      },
      order_id: {
        CreateInvoiceDto: 'order_id',
      },
      invoice_category_id:{
        CreateInvoiceDto:'invoice_category_id'
      }
    };
  
    return mapping[value]?.[targetName] || value;
  };

  defaultMessage(validationArguments?: ValidationArguments): string {
    const transformKey = validationArguments?.property;
    const key = this.transformDefautName(transformKey, validationArguments);
    return this.i18n.t('validator.is_not_empty', {
      lang: validationArguments?.object['lang'],
      args: {
        name: this.i18n.t(LIST_TRANFORMS[key], {
          lang: validationArguments?.object['lang'],
        }),
      },
    });
  }
}
