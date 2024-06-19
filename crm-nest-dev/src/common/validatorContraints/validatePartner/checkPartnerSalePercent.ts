import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { partnerSaleOption } from 'src/components/partner/enum/partner.enum';
import { I18nTranslations } from 'src/generated/i18n.generated';

@ValidatorConstraint({ name: 'CheckPartnerSalePercent', async: false })
@Injectable()
export class CheckPartnerSalePercent implements ValidatorConstraintInterface {
  constructor(@Inject(I18nService) private readonly i18n: I18nService<I18nTranslations>){}
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    if(validationArguments?.object['partnerId'] && !value && validationArguments?.object['partnerId'] == partnerSaleOption.TOTAL_PAYMENT_BY_PERIOD) {
        return false
    }

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return (this.i18n.t('validator.is_not_empty', {lang: validationArguments?.object["lang"], args: {name: validationArguments?.property}}))
  }
}
