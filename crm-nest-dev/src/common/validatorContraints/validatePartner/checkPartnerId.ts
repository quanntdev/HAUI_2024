import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

@ValidatorConstraint({ name: 'CheckPartnerId', async: false })
@Injectable()
export class CheckPartnerId implements ValidatorConstraintInterface {
  constructor(@Inject(I18nService) private readonly i18n: I18nService<I18nTranslations>){}
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    if(validationArguments?.object['partnerSaleType'] && !value) {
        return false
    }

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const name = this.i18n.t('validator.keyword.sale_partner', {lang: validationArguments?.object["lang"]})
    return (this.i18n.t('validator.is_not_empty', {lang: validationArguments?.object["lang"], args: {name: name}}))
  }
}
