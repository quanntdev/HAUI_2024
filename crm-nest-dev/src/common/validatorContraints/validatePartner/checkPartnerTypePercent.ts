import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { partnerSaleOption } from 'src/components/partner/enum/partner.enum';
import { I18nTranslations } from 'src/generated/i18n.generated';

@ValidatorConstraint({ name: 'CheckPartnerTypePercent', async: false })
@Injectable()
export class CheckPartnerTypePercent implements ValidatorConstraintInterface {
  constructor(@Inject(I18nService) private readonly i18n: I18nService<I18nTranslations>){}
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    if (validationArguments?.object['partnerSaleType']) {
      if (
        Number(validationArguments?.object['partnerSaleType']) ===
          partnerSaleOption.TOTAL_PAYMENT_REVENUE &&
        value !== ''
      ) {
        return false;
      }

      if (
        Number(validationArguments?.object['partnerSaleType']) ===
          partnerSaleOption.TOTAL_PAYMENT_BY_PERIOD &&
        value === ''
      ) {
        return false;
      }
    }

    if(!validationArguments?.object['partnerSaleType'] && value) {
        return false
    }

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    if(!validationArguments?.object['partnerSaleType'] && validationArguments?.value) {
        return `You must choose partnerSaleType`
    }

    if (validationArguments?.object['partnerSaleType']) {
        if (
          Number(validationArguments?.object['partnerSaleType']) ===
            partnerSaleOption.TOTAL_PAYMENT_REVENUE &&
            validationArguments?.value !== ''
        ) {
          return (this.i18n.t('validator.is_not_empty', {lang: validationArguments?.object["lang"], args: {name: validationArguments?.property}}))
        }
        if (
          Number(validationArguments?.object['partnerSaleType']) ===
            partnerSaleOption.TOTAL_PAYMENT_BY_PERIOD && validationArguments?.value === ''
        ) {
          return (this.i18n.t('validator.is_not_empty', {lang: validationArguments?.object["lang"], args: {name: validationArguments?.property}}));
        }
      }

    return `validate fail`;
  }
}
