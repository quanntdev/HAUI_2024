import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

import { BaseExceptionFilter } from '@nestjs/core';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ERROR_CODES } from '../constants';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(private i18n) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const lang = value?.lang;

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    const recursiveError = (item) =>
      item.children &&
      item.children.length &&
      item.children.reduce(
        (accmuChild, itemChild) => ({
          ...accmuChild,
          [itemChild.property]:
            recursiveError(itemChild) || itemChild.constraints || 'undefined',
        }),
        {},
      );

    if (errors.length > 0) {
      throw new HttpException(
        {
          statusCode: 400,
          error: ERROR_CODES.BAD_REQUEST,
          message: this.i18n.t('message.status_messages.validate_failed', {
            lang: lang,
          }),
          properties: errors.reduce(
            (accmu, item) => ({
              ...accmu,
              [item.property]:
                recursiveError(item) || item.constraints || 'undefined',
            }),
            {},
          ),
        },
        400,
      );
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      error: exception,
    });
  }
}
