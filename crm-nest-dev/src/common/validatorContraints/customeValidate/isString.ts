import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

@ValidatorConstraint({ name: 'IsStringValidate', async: false })
@Injectable()
export class IsStringValidate implements ValidatorConstraintInterface {

  constructor(@Inject(I18nService) private readonly i18n: I18nService<I18nTranslations>){}

  validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
    if (typeof value === 'string' || value instanceof String || value === "") {
      return true;
    }
    return false;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return (this.i18n.t('validator.is_not_empty', {lang: validationArguments?.object["lang"], args: {name: validationArguments?.property}}))
  }
}
