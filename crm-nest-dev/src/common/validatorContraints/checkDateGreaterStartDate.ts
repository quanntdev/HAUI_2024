import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments
} from 'class-validator';
import * as moment from "moment";
import { Inject } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

@ValidatorConstraint({ name: 'CheckDateGreaterStartDate', async: false })
export class CheckDateGreaterStartDate implements ValidatorConstraintInterface {
    constructor(@Inject(I18nService) private readonly i18n: I18nService<I18nTranslations>){}
    validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        if (moment(value).isAfter(validationArguments?.object["startDate"])) {
            return true;
        }
        return false;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return (this.i18n.t('validator.check_end_date', {lang: validationArguments?.object["lang"]}))
    }
}
