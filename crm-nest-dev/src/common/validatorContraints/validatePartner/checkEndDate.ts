import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

@ValidatorConstraint({ name: 'CheckEndDate', async: false })
@Injectable()
export class CheckEndDate implements ValidatorConstraintInterface {
  constructor(@Inject(I18nService) private readonly i18n: I18nService<I18nTranslations>){}
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    if (value) {
      if (moment(value).isAfter(validationArguments?.object['saleStartDate'])) {
        return true;
      } else {
        return false;
      }
    }

    return true
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return (this.i18n.t('validator.check_end_date', {lang: validationArguments?.object["lang"]}))
  }
}
