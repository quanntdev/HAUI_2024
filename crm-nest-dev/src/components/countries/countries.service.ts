import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Repository, Brackets } from 'typeorm';
import { Country, City } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { checkMysqlError } from '../../common/validatorContraints/checkMysqlError';
import { checkExistNestedData } from 'src/common/utils/checkExistNestedData';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    private i18n: I18nService<I18nTranslations>,
  ) {}

  async create(createCountryDto: CreateCountryDto, Headers: any) {
    try {
      const lang = Headers.lang;
      let { name, ...countryData } = createCountryDto;
      let createData: any = {
        ...countryData,
      };

      const existingCountry = await this.countryRepository.findOne({
        where: { name },
      });

      if (existingCountry) {
        throw new Error(
          this.i18n.t('message.country.country_has_been_created', {
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

      const country = await this.countryRepository.save(createData);

      return {
        message: this.i18n.t('message.status_messages.create_success', {
          lang: lang,
        }),
        data: country,
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
      const { keyword } = pagination;

      const data = this.countryRepository
        .createQueryBuilder('country')
        .leftJoinAndSelect('country.cities', 'city')
        .orderBy('country.id', 'DESC');
      if (keyword) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('country.name LIKE :keyword', {
              keyword: `%${keyword}%`,
            });
          }),
        );
      }

      const countryList = await data.getMany();
      return {
        data: countryList,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} country`;
  }

  update(id: number, updateCountryDto: UpdateCountryDto) {
    return `This action updates a #${id} country`;
  }

  async remove(id: number, Headers: any) {
    const lang = Headers.lang;
    const country = await this.countryRepository.findOne({
      where: { id },
      relations: {
        customers: true,
      },
    });

    await this.cityRepository.delete({
      country: {
        id: id,
      },
    });

    if (!country) {
      throw new NotFoundException(
        this.i18n.t('message.status_messages.data_not_found', { lang: lang }),
      );
    }
    if (checkExistNestedData(country.customers)) {
      throw new BadRequestException(
        this.i18n.t('message.status_messages.existed_relation_data', {
          lang: lang,
        }),
      );
    }
    await this.countryRepository.softDelete(id);
    return {
      data: [],
      message: this.i18n.t('message.status_messages.delete_success', {
        lang: lang,
      }),
    };
  }
}
