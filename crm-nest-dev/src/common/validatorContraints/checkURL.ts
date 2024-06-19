import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';
import { checkIsURL } from '../utils/checURLfuncion';
import { Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

@ValidatorConstraint({ name: 'CheckURL', async: false })
@Injectable()
export class CheckURL implements ValidatorConstraintInterface {
  constructor(@Inject(I18nService) private readonly i18n: I18nService<I18nTranslations>){}
  validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
    if ((value == "")  || checkIsURL(value)) {
      return true;
    }
    return false;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} ${this.i18n.t('validator.must_be_url', {lang: validationArguments?.object["lang"]})}`;
  }
}
