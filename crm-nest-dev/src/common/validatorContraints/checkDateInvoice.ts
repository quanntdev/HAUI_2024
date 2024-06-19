import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';
import * as moment from "moment";

@ValidatorConstraint({ name: 'CheckDateInvoice', async: false })
export class CheckDateInvoice implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
    if (moment(value).isAfter(validationArguments?.object["start_date"])) {
      return true;
    }
    return false;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} must be greater than invoice date`;
  }
}
