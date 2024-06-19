import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  isEmail
} from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

@ValidatorConstraint({ name: 'CheckIsEmail', async: false })
@Injectable()
export class CheckIsEmail implements ValidatorConstraintInterface {
  constructor(@Inject(I18nService) private readonly i18n: I18nService<I18nTranslations>){}
  validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
    if ((value == "")  || isEmail(value)) {
      return true;
    }
    return false;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return (this.i18n.t('validator.must_be_email', {lang: validationArguments?.object["lang"]}))
  }
}
