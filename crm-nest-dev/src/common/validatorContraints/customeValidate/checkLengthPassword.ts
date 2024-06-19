import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { MIN_CHARACTER } from 'src/constants';
import { I18nTranslations } from 'src/generated/i18n.generated';

@ValidatorConstraint({ name: 'CheckLengthPassword', async: false })
@Injectable()
export class CheckLengthPassword implements ValidatorConstraintInterface {

  constructor(@Inject(I18nService) private readonly i18n: I18nService<I18nTranslations>){}

  validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
    if (value && value.length >= MIN_CHARACTER) {
      return true;
    }
    return false;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return (this.i18n.t('validator.password_length', {lang: validationArguments?.object["lang"], args: {name: validationArguments?.property}}))
  }
}
