import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSaleChannelDto } from './dto/create-sale-channel.dto';
import { Brackets, Repository } from 'typeorm';
import { SaleChannel } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { checkMysqlError } from '../../common/validatorContraints/checkMysqlError';
import { checkExistNestedData } from 'src/common/utils/checkExistNestedData';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SaleChannelService {
  constructor(
    @InjectRepository(SaleChannel)
    private readonly saleChannelRepository: Repository<SaleChannel>,

    private i18n: I18nService<I18nTranslations>,
  ) {}

  async create(createSaleChannelDto: CreateSaleChannelDto, Headers: any) {
    try {
      const lang = Headers.lang;
      let { name, ...saleChannelData } = createSaleChannelDto;
      let createData: any = {
        ...saleChannelData,
      };
      const existingSaleChannel = await this.saleChannelRepository.findOne({
        where: { name },
      });
      if (existingSaleChannel) {
        throw new Error(
          this.i18n.t('message.sale-chanel.sale-chanel_has_been_created', {
            lang: lang,
            args: { name: name },
          }),
        );
      }
      if (name) {
        createData = {
          ...createData,
          name: name,
        };
      }
      const saleChannel = await this.saleChannelRepository.save(createData);
      return {
        message: this.i18n.t('message.status_messages.create_success', {
          lang: lang,
        }),
        data: saleChannel,
      };
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      checkMysqlError(e);
    }
  }

  async findAll(pagination: any) {
    try {
      const { name } = pagination;

      const data = this.saleChannelRepository
        .createQueryBuilder('sale_channels')
        .orderBy('sale_channels.id', 'DESC');

      if (name) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('sale_channels.name LIKE :keyword', {
              keyword: `%${name}%`,
            });
          }),
        );
      }

      const saleChannelList = await data.getMany();
      return { data: saleChannelList };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} country`;
  }

  update(id: number) {
    return `This action updates a #${id} country`;
  }

  async remove(id: number, Headers: any) {
    const lang = Headers.lang;
    const saleChannel = await this.saleChannelRepository.findOne({
      where: { id },
      relations: {
        customers: true,
      },
    });
    if (!saleChannel) {
      throw new NotFoundException(
        this.i18n.t('message.status_messages.data_not_found', {
          lang: lang,
        }),
      );
    }
    if (checkExistNestedData(saleChannel.customers)) {
      throw new BadRequestException(
        this.i18n.t('message.status_messages.existed_relation_data', {
          lang: lang,
        }),
      );
    }
    await this.saleChannelRepository.softDelete(id);
    return {
      data: [],
      message: this.i18n.t('message.status_messages.delete_success', {
        lang: lang,
      }),
    };
  }
}
