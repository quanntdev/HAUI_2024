import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { RequestWithUser } from 'src/common/interfaces';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';
import { ROLE_NAME } from 'src/constants';
import { Customer, CustomerLevel } from 'src/entities';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { Brackets, Repository } from 'typeorm';
import { CreateCustomerLevelDto } from './dto/create-customer-level.dto';
import { UpdateCustomerLevelDto } from './dto/update-customer-level.dto';

@Injectable()
export class CustomerLevelService {
  constructor(
    @InjectRepository(CustomerLevel)
    private readonly customerLevelRepository: Repository<CustomerLevel>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    private i18n: I18nService<I18nTranslations>,
  ) {}

  async create(
    body: CreateCustomerLevelDto,
    Headers: any,
    req: RequestWithUser,
  ) {
    try {
      const lang = Headers.lang;

      const { name } = body;

      if (req.user.kind !== ROLE_NAME.ADMIN) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.unauthorized', { lang: lang }),
        );
      }

      const checkCustomerLevelName = await this.customerLevelRepository.findOne(
        {
          where: { name: name },
        },
      );

      if (checkCustomerLevelName) {
        throw new BadRequestException(
          this.i18n.t(
            'message.status_messages.Customer_Level_name_already_exists',
            { lang: lang },
          ),
        );
      }

      await this.customerLevelRepository.save(body);

      return {
        data: body,
        message: this.i18n.t('message.status_messages.create_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async remove(id: number, Headers: any, req: RequestWithUser) {
    try {
      const lang = Headers.lang;

      if (req.user.kind !== ROLE_NAME.ADMIN) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.unauthorized', { lang: lang }),
        );
      }

      const level = await this.customerLevelRepository.findOne({
        where: { id: id },
        relations: {
          customers: true,
        },
      });

      if (!level) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.not_found', { lang: lang }),
        );
      }

      if (level.customers.length > 0) {
        throw new BadRequestException(
          this.i18n.t(
            'message.status_messages.cannot_delete_because_relations',
            { lang: lang },
          ),
        );
      }

      await this.customerLevelRepository.softDelete(id);

      return {
        message: this.i18n.t('message.status_messages.delete_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async update(
    id: number,
    body: UpdateCustomerLevelDto,
    Headers: any,
    req: RequestWithUser,
  ) {
    try {
      const lang = Headers.lang;
      if (req.user.kind !== ROLE_NAME.ADMIN) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.unauthorized', { lang: lang }),
        );
      }

      const checkCustomerLevel = await this.customerLevelRepository.findOne({
        where: { id: id },
      });

      if (!checkCustomerLevel) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.not_found', { lang: lang }),
        );
      }

      checkCustomerLevel.name = body.name;
      checkCustomerLevel.description = body.description;

      await this.customerLevelRepository.save(checkCustomerLevel);

      return {
        data: checkCustomerLevel,
        message: this.i18n.t('message.status_messages.update_success', {
          lang,
        }),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findOne(id: number, Headers: any, req: RequestWithUser) {
    try {
      const lang = Headers.lang;

      if (req.user.kind !== ROLE_NAME.ADMIN) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.unauthorized', { lang: lang }),
        );
      }
      const data = await this.customerLevelRepository.findOne({
        where: { id: id },
      });

      if (!data) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.not_found', { lang: lang }),
        );
      }
      return data;
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findAll(Headers: any, req: RequestWithUser, pagination: any) {
    try {
      const { name } = pagination;

      const data = this.customerLevelRepository
        .createQueryBuilder('customer_level')
        .orderBy('customer_level.id', 'DESC');

      if (name) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('customer_level.name LIKE :keyword', {
              keyword: `%${name}%`,
            });
          }),
        );
      }

      const dataRes = await data.getMany();
      return { data: dataRes };
    } catch (e) {
      checkMysqlError(e);
    }
  }
}
