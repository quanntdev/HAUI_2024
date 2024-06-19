import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'CheckDateTimePartner', async: false })
export class CheckDateTimePartner implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    if(value === "" || moment(value, 'YYYY-MM-DD', true).isValid()) {
        return true;
    }
    return false
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} must be a date`;
  }
}
