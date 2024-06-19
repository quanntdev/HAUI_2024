import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { LIST_TRANFORMS } from './const';

@ValidatorConstraint({ name: 'CheckFaxPhone', async: false })
@Injectable()
export class CheckFaxPhone implements ValidatorConstraintInterface {
  constructor(
    @Inject(I18nService) private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {

    if(value === "") {
      return true
    }

    if (typeof value !== 'string') {
      return false;
    }
    value = value.trim();
    if (value === '') {
      return false;
    }

    for (const char of value) {
      if (char < '0' || char > '9') {
        return false;
      }
    }
    
    return true;
  }



  defaultMessage(validationArguments?: ValidationArguments): string {
    
    const transformKey =  validationArguments?.property

    return this.i18n.t('validator.only_number', {
      lang: validationArguments?.object['lang'],
      args: {
        name: this.i18n.t(LIST_TRANFORMS[transformKey], {
          lang: validationArguments?.object['lang'],
        }),
      },
    });

  }
}
