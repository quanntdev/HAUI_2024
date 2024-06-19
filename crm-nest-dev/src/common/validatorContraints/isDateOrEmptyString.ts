import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

@ValidatorConstraint({ name: 'IsDateStringOrEmpty', async: false })
@Injectable()
export class IsDateStringOrEmpty implements ValidatorConstraintInterface {
  constructor(@Inject(I18nService) private readonly i18n: I18nService<I18nTranslations>){}
  validate(text: string, args: ValidationArguments) {
    if (text === '' || text === "null") {
      return true;
    } else {
      return (
        !!text &&
        Boolean(text.match(/^(\d{4}-\d{2}-\d{2})$/g)) &&
        Boolean(Date.parse(text))
      );
    }
  }

  defaultMessage(args: ValidationArguments) {
    return this.i18n.t('validator.date_value_false', {lang: args?.object["lang"]});
  }
}
