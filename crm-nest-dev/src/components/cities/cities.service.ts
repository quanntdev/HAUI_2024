import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { checkMysqlError } from '../../common/validatorContraints/checkMysqlError';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { Country, City } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SUCCESS_CODES } from 'src/constants/successCodes';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}
  async create(createCityDto: CreateCityDto) {
    const {name, countryCode} = createCityDto
    try {
      const country = await this.countryRepository.findOne({
        where: {
          name: countryCode
        },
        relations: {
          cities: true
        }
      })
      if(country && country.cities.length == 0) {
        const listCities = name.split(",");
        const dataCreata:any = listCities.map((item:any) => ({
          name: item,
          country: Number(country.id)
        }))

        await this.cityRepository.save(dataCreata)

        return {
          message: SUCCESS_CODES.CREATE_SUCCESSFULLY,
        }
      } else {
        throw new BadRequestException("CANNOT UPDATE THIS COUNTRY CODE");
      }
    } catch(e) {
      checkMysqlError(e)
    }
  }

  findAll() {
    return `This action returns all cities`;
  }
  async findCity(countryId: number) {
    try {
      const cityList = await this.cityRepository.find({
        where: {
          country: {
            id: countryId,
          },
        },
        relations: {
          country: true,
        },
      });
      return {
        data: cityList,
      };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      checkMysqlError(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} city`;
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return `This action updates a #${id} city`;
  }

  remove(id: number) {
    return `This action removes a #${id} city`;
  }
}
