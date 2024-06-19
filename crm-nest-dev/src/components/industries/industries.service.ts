import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { checkMysqlError } from '../../common/validatorContraints/checkMysqlError';
import { Like, Repository } from 'typeorm';
import { Industry } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestWithUser } from 'src/common/interfaces';
import { ROLE_NAME } from 'src/constants';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class IndustriesService {
  constructor(
    @InjectRepository(Industry)
    private readonly industryRepository: Repository<Industry>,
    private i18n: I18nService<I18nTranslations>,
  ) {}

  async create(body: CreateIndustryDto, Headers: any, req: RequestWithUser) {
    try {
      const { name } = body;
      const lang = Headers.lang;

      if (req.user.kind !== ROLE_NAME.ADMIN) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.unauthorized', { lang: lang }),
        );
      }

      const checkIndustry = await this.industryRepository.findOne({
        where: { name: name },
      });

      if (checkIndustry) {
        throw new BadRequestException(
          this.i18n.t(
            'message.status_messages.Customer_Level_name_already_exists',
            { lang: lang },
          ),
        );
      }

      await this.industryRepository.save(body);
      return {
        data: body,
        message: this.i18n.t('message.status_messages.create_success', {
          lang: lang,
        }),
      };
    } catch (error) {
      checkMysqlError(error);
    }
  }

  async findAll(pagination: any) {
    try {
      const { name } = pagination;
      let data = await this.industryRepository.find({
        order: {
          updatedAt: 'DESC',
        },
      });

      if (name) {
        data = await this.industryRepository.find({
          where: {
            name: Like(`%${name}%`),
          },
          order: {
            updatedAt: 'DESC',
          },
        });
      }

      return {
        data: data,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} industry`;
  }

  async update(
    id: number,
    body: UpdateIndustryDto,
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

      const checkIndustry = await this.industryRepository.findOne({
        where: { id: id },
      });

      if (!checkIndustry) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.not_found', { lang: lang }),
        );
      }

      checkIndustry.name = body.name;

      await this.industryRepository.save(checkIndustry);

      return {
        data: checkIndustry,
        message: this.i18n.t('message.status_messages.update_success', {
          lang,
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

      const industry = await this.industryRepository.findOne({
        where: { id: id },
        relations: {
          customers: true,
        },
      });

      if (!industry) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.not_found', { lang: lang }),
        );
      }

      if (industry.customers.length > 0) {
        throw new BadRequestException(
          this.i18n.t(
            'message.status_messages.cannot_delete_because_relations',
            { lang: lang },
          ),
        );
      }

      await this.industryRepository.softDelete(id);

      return {
        message: this.i18n.t('message.status_messages.delete_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }
}
