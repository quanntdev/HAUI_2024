import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Currency,
  Partner,
  PartnerInvoice,
  PaymentPartner,
  User,
} from 'src/entities';
import { Brackets, Repository } from 'typeorm';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';
import { customerPriority } from '../customers/enum/customer.enum';
import { checkExistInRepo } from 'src/common/utils/checkExistInRepo';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { DEFAULT_LIMIT_PAGINATE, FOMAT_DATE_TIME } from 'src/constants/constants';
import {
  PaginationQuery,
  PaginationResponseWithTotalData,
} from 'src/common/dtos';
import { RequestWithUser } from 'src/common/interfaces';
import { UpdatepartnerDto } from './dto/update-partner.dto';
import { ROLE_NAME } from 'src/constants';
import * as moment from 'moment';


@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(PartnerInvoice)
    private readonly partnerInvoiceRepository: Repository<PartnerInvoice>,

    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,

    @InjectRepository(PaymentPartner)
    private readonly paymentPartnerRepository: Repository<PaymentPartner>,
    private i18n: I18nService<I18nTranslations>,
  ) {}

  async create(createPartnerDto: CreatePartnerDto, req, headers) {
    try {
      const { assignedId, priorityId, ...partnerDTO } = createPartnerDto;

      const lang = headers.lang;

      let dataCreatePartner: any = { ...partnerDTO };
      if (priorityId && priorityId in customerPriority) {
        dataCreatePartner = {
          ...dataCreatePartner,
          priority: Number(priorityId),
        };
      }

      if (
        assignedId &&
        (await checkExistInRepo(assignedId, this.userRepository))
      ) {
        dataCreatePartner = {
          ...dataCreatePartner,
          userAssign: Number(assignedId),
        };
      }

      const partner = await this.partnerRepository.save(dataCreatePartner);

      return {
        message: this.i18n.t('message.status_messages.create_success', {
          lang: lang,
        }),
        data: partner,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findAll(pagination: any, req: RequestWithUser) {
    try {
      const {
        offset = 0,
        limit = DEFAULT_LIMIT_PAGINATE,
        keyword,
        listPriority,
        userAssign,
      } = pagination;

      const userId = Number(req.user.userId);
      const kind = req.user.kind;

      const data = this.partnerRepository
        .createQueryBuilder('partner')
        .leftJoinAndSelect('partner.userAssign', 'userAssign')
        .leftJoinAndSelect('userAssign.profile', 'profile')
        .leftJoinAndSelect('partner.partnersCustomer', 'partnerCus')
        .leftJoinAndSelect('partnerCus.partnerCustomer', 'partnerCustomer')
        .leftJoinAndSelect('partnerCus.partnerOrder', 'partnerOrder')
        .orderBy('partner.updatedAt', 'DESC')
        .skip(offset)
        .take(limit);

      if (kind === ROLE_NAME.SALE_ASSISTANT) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('userAssign.id = :userId', {
              userId: userId,
            });
          }),
        );
      }

      if (keyword) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('partner.email LIKE :keyword', {
              keyword: `%${keyword}%`,
            }).orWhere('partner.name LIKE :keyword', {
              keyword: `%${keyword}%`,
            });
          }),
        );
      }

      if (userAssign) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('partner.userAssign = :userAssign', {
              userAssign: userAssign,
            });
          }),
        );
      }

      if (listPriority) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('partner.priority IN (:listPriority)', {
              listPriority: listPriority.split(','),
            });
          }),
        );
      }

      const [partner, count] = await data.getManyAndCount();
      const response = new PaginationResponseWithTotalData<any>(partner, count);

      return {
        data: response,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findOne(
    id: number,
    pagination: PaginationQuery,
    headers: any,
    req: RequestWithUser,
  ) {
    const lang = headers.lang;
    const kind = req.user.kind;
    const userId = req.user.userId;
    try {
      if (!id)
        throw new NotFoundException(
          this.i18n.t('message.status_messages.not_found', { lang: lang }),
        );
      const partner = await this.partnerRepository.findOne({
        where: { id: +id },
        relations: {
          partnersCustomer: {
            partnersInvoice: true,
            partnerCustomer: {
              currency: true,
            },
            partnerOrder: {
              paymentPartner: true,
            },
          },
          userAssign: {
            profile: true,
          },
          paymentPartner: true,
        },
        order: {
          partnersCustomer: {
            id: 'DESC',
          },
        },
      });

      if (
        kind === ROLE_NAME.SALE_ASSISTANT &&
        Number(userId) !== Number(partner?.userAssign?.id)
      ) {
        throw new NotFoundException();
      }

      if (!partner)
        throw new NotFoundException(
          this.i18n.t('message.status_messages.not_found', { lang: lang }),
        );

      const invoiceAmount =
        partner?.partnersCustomer[0]?.partnersInvoice?.reduce(
          (acc: number, obj: any) => acc + Number(obj.commisson_amount),
          0,
        );
      const paymentAmount = partner?.paymentPartner?.reduce(
        (acc: number, obj: any) => acc + Number(obj.amount),
        0,
      );
      return {
        data: partner,
        invoicePartnerAmount: invoiceAmount,
        paymentPartnerAmount: paymentAmount,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async remove(id, headers) {
    try {
      const lang = headers.lang;
      if (!+id)
        throw new NotFoundException(
          this.i18n.t('message.status_messages.not_found', { lang: lang }),
        );

      const partner: any = await this.partnerRepository.findOne({
        where: { id: +id },
        relations: {
          partnersCustomer: {
            partnerCustomer: true,
            partnersInvoice: true,
          },
          paymentPartner: true,
        },
      });

      if (!partner) {
        throw new NotFoundException(
          this.i18n.t('message.status_messages.not_found', { lang: lang }),
        );
      }

      if (
        (partner?.partnersCustomer &&
          (partner?.partnersCustomer?.partnerCustomer?.length > 0 ||
            partner?.partnersCustomer?.partnersInvoice?.length > 0)) ||
        partner?.paymentPartner.length > 0
      ) {
        throw new NotFoundException(
          this.i18n.t('message.status_messages.EXISTED_RELATION_DATA', {
            lang: lang,
          }),
        );
      }

      await this.partnerRepository.softDelete(+id);

      return {
        data: [],
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
    updatePartnerDto: UpdatepartnerDto,
    req: RequestWithUser,
    Headers,
  ) {
    try {
      const lang = Headers.lang;
      if (!id)
        throw new NotFoundException(
          this.i18n.t('message.status_messages.not_found', { lang: lang }),
        );

      const partner = await this.partnerRepository.findOne({
        where: { id: +id },
        relations: {
          userAssign: true,
        },
      });

      if (!partner)
        throw new NotFoundException(
          this.i18n.t('message.status_messages.not_found', { lang: lang }),
        );

      const { assignedId, priorityId, ...dataPartnerDto } = updatePartnerDto;

      let updateData: any = {
        ...dataPartnerDto,
      };

      delete updateData.lang;

      if (
        assignedId &&
        (await checkExistInRepo(assignedId, this.userRepository))
      ) {
        updateData = {
          ...updateData,
          userAssign: Number(assignedId),
        };
      }

      if (priorityId && priorityId in customerPriority) {
        updateData = {
          ...updateData,
          priority: Number(priorityId),
        };
      }

      await this.partnerRepository.update(+id, {
        ...updateData,
        updatedAt: moment(new Date()).format(FOMAT_DATE_TIME),
      });

      const partnerUpdate = await this.partnerRepository.findOne({
        where: { id: +id },
        relations: {
          partnersCustomer: {
            partnerOrder: true,
            partnerCustomer: true,
          },
          userAssign: {
            profile: true,
          },
        },
      });

      return {
        data: partnerUpdate,
        message: this.i18n.t('message.status_messages.update_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async getContract(
    id: number,
    pagination: PaginationQuery,
    headers: any,
    req: RequestWithUser,
  ) {
    try {
      const payment = await this.paymentPartnerRepository.find({
        where: { partner: { id } },
        relations: { currency: true },
      });

      const invoice = await this.partnerInvoiceRepository.find({
        where: { customerPartner: { partners: { id } } },
      });

      const currency = await this.currencyRepository.find();

      const paymentData = payment.map(({ currency, amount }) => ({
        currency_sign: currency.sign,
        amount: +amount,
      }));
      const invoiceData = invoice.map(
        ({ currency_sign, commisson_amount }) => ({
          currency_sign,
          amount: +commisson_amount,
        }),
      );
      const data = {
        paymentPartner:  this.transformData(paymentData),
        invoice:  this.transformData(invoiceData),
      };

      const baseCurreny = currency.filter((item) => item.default)[0];

      const contractArray = this.contractPartner(data, currency);
      const sumBalance = contractArray.reduce((total, currentValue) => total + currentValue.toBaseCurr, 0);

      const baseCurrency = baseCurreny?.name;

      const totalPaymentAndInvoice = this.totalPaymentInvoice(currency, data, baseCurrency)

      return {
        balace: contractArray,
        invoice: invoiceData,
        payment: paymentData,
        baseCurreny: baseCurreny,
        totalPaymentAndInvoice,
        sumBalance
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  private totalPaymentInvoice(currency: any, data:any, baseCurrency ){
    let paymentPartnerTotal = 0;
    let invoiceTotal = 0;

    for (const currencyItem of currency) {
      const exchangeRate = parseFloat(
        Number(currencyItem.exchange_rate) > 0
          ? currencyItem.exchange_rate.toString()
          : '1',
      );
      const sign = currencyItem.sign;
      const paymentPartnerValue = (data.paymentPartner[sign] ?? 0) / exchangeRate;
      const invoiceValue = (data.invoice[sign] ?? 0) / exchangeRate;
    
      if (sign === baseCurrency) {
        paymentPartnerTotal += data.paymentPartner[sign];
        invoiceTotal += data.invoice[sign];
      } else {
        paymentPartnerTotal += paymentPartnerValue;
        invoiceTotal += invoiceValue;
      }
    }

    return {
      paymentPartnerTotal,
      invoiceTotal
    }
  }

  private contractPartner(data:any, currency: any) {
    const contractArray = [];

    for (const cur in data.invoice) {
      const contract = {
        cur,
        value: data.invoice[cur] - data.paymentPartner[cur],
      };
      contractArray.push(contract);
    }

    for (const contract of contractArray) {
      const curr = contract.cur;
      const value = contract.value;
      const exchange_rate = currency.find(item => item.sign === curr)?.exchange_rate;
      contract.toBaseCurr = value / parseFloat(Number(exchange_rate) === 0 ? 1 : exchange_rate);
    }

    return contractArray
  }

  public transformData(data: any) {
    const result = {};

    data.forEach((item) => {
      const { currency_sign, amount } = item;
      if (result[currency_sign]) {
        result[currency_sign] += amount;
      } else {
        result[currency_sign] = amount;
      }
    });

    return result;
  }
}
