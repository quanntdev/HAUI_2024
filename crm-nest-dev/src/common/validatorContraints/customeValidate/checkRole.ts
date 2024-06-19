import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

@ValidatorConstraint({ name: 'CheckRole', async: false })
@Injectable()
export class CheckRole implements ValidatorConstraintInterface {

  constructor(@Inject(I18nService) private readonly i18n: I18nService<I18nTranslations>){}

  validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
    if (Number(value) === 1 || Number(value) === 2 || Number(value) === 3) {
      return true;
    }
    return false;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return (this.i18n.t('validator.role_validate', {lang: validationArguments?.object["lang"], args: {name: validationArguments?.property}}))
  }
}
