import { BadRequestException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';

@ValidatorConstraint({ name: 'CheckLang', async: false })
export class CheckLang implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
   return true
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    throw new  BadRequestException(` Please enter [ ${validationArguments.property} ] no more than 255 characters`);
  }
}
