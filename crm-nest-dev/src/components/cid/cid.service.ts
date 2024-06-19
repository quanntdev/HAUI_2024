import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cid } from 'src/entities';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateCidDto } from './dto/create-cid.dto';
import { UpdateCidDto } from './dto/update-cid.dto';
import { checkMysqlError } from '../../common/validatorContraints/checkMysqlError';
import { ERROR_CODES } from '../../constants/errorCodes';
import { CID_MAX_LENGTH } from 'src/constants';
import { SUCCESS_CODES } from '../../constants/successCodes';
import { Customer } from '../../entities/customer.entity';
import { Country } from 'src/entities';
import { isNumber } from 'class-validator';

@Injectable()
export class CidService {
  constructor(
    @InjectRepository(Cid)
    private readonly cidRepository: Repository<Cid>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}
}
