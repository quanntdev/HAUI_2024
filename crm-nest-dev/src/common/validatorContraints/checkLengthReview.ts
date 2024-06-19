import { BadRequestException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';

@ValidatorConstraint({ name: 'CheckLengthReview', async: false })
export class CheckLengthReview implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
    if (value && value.length <= 255 || value == "") {
      return true;
    }
    return false;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    throw new  BadRequestException(` Please enter [ ${validationArguments.property} ] no more than 255 characters`);
  }
}
