import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
@ValidatorConstraint({ name: 'IsNumberText', async: false })
@Injectable()
export class IsNumberText implements ValidatorConstraintInterface {
  constructor(
    @Inject(I18nService) private readonly i18n: I18nService<I18nTranslations>,
  ) {}
  validate(text: any, args: ValidationArguments) {
    let str = text;
    str = str?.toString()?.replace(/[,.]/g, '');
    if (isNaN(str)) {
      return false;
    }

    if (text == '') {
      return true;
    } else {
      const format = /^(\s*|\d[\d,.]*)$/;
      return format.test(text);
    }
  }

  defaultMessage(args: ValidationArguments) {
   let property = args.property
   let name;
   if(property == 'phone'){
      name = this.i18n.t('validator.keyword.phone', {
      lang: args?.object['lang'],
    })
   }
    
    return `${name} ${this.i18n.t('validator.only_number_text', {
      lang: args?.object['lang'],
    })}`;
  }
}

@ValidatorConstraint({ name: 'IsCiD', async: false })
@Injectable()
export class IsCiD implements ValidatorConstraintInterface {
  constructor(
    @Inject(I18nService) private readonly i18n: I18nService<I18nTranslations>,
  ) {}
  validate(text: string, args: ValidationArguments) {
    const format = /^(\s*|\d\d*)/;
    if (Number(text) > 9999 || (!Number(text) && text != '')) {
      return false;
    }
    return format.test(text);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} ${this.i18n.t('validator.cid_fail', {
      lang: args?.object['lang'],
    })}`;
  }
}
