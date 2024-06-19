import {
  BadRequestException,
  Injectable,
  NotFoundException,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from '../../entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';
import { Tag } from '../../entities/tag.entity';
import { Industry } from '../../entities/industry.entity';
import { EmployeeConfig } from '../../entities/employeeConfig.entity';
import {
  PaginationQuery,
  PaginationResponseWithTotalData,
} from '../../common/dtos';
import { ERROR_CODES } from '../../constants/errorCodes';
import {
  Cid,
  Country,
  City,
  LogNote,
  Currency,
  CustomerLevel,
  User,
  Notification,
  SaleChannel,
  Partner,
  PartnerCustomer,
  Deal,
  Order,
  Invoice,
  Payment,
  Task,
  Contact,
} from 'src/entities';
import { checkExistNestedData } from 'src/common/utils/checkExistNestedData';
import { checkExistInRepo } from 'src/common/utils/checkExistInRepo';
import { LogNoteObject } from '../log-notes/enum/log-note-object.enum';
import { LogNoteActions } from '../log-notes/enum/log-note-actions.enum';
import { RequestWithUser } from 'src/common/interfaces';
import { getLogNotes, transformLogNote } from 'src/common/utils/queryLogNotes';
import {
  CID_MAX_LENGTH,
  DEFAULT_LIMIT_PAGINATE,
  FOMAT_DATE_TIME,
  ROLE_NAME,
} from 'src/constants';
import { IsNull, Not } from 'typeorm';
import { isNumber } from 'class-validator';
import { customerPriority } from './enum/customer.enum';
import { NotificationSave } from 'src/common/utils/saveNotifications';
import {
  notificationAction,
  notificationSeenAction,
} from '../notifications/enum/notifications.enum';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { renderFilename } from 'src/common/utils/renderFilename';
import { partnerSaleOption } from '../partner/enum/partner.enum';
import * as moment from 'moment';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(Industry)
    private readonly industryRepository: Repository<Industry>,

    @InjectRepository(EmployeeConfig)
    private readonly employeeRepository: Repository<EmployeeConfig>,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,

    @InjectRepository(Cid)
    private readonly cidRepository: Repository<Cid>,

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(LogNote)
    private readonly logNoteRepository: Repository<LogNote>,

    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,

    @InjectRepository(CustomerLevel)
    private readonly customerLevelRepository: Repository<CustomerLevel>,

    @InjectRepository(SaleChannel)
    private readonly saleChannelRepository: Repository<SaleChannel>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,

    @InjectRepository(PartnerCustomer)
    private readonly partnerCustomerRepository: Repository<PartnerCustomer>,

    private i18n: I18nService<I18nTranslations>,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto,
    req: any,
    Headers: any,
    attachment: any = null,
  ) {
    try {
      const lang = Headers.lang;
      const userId = req.user.userId;
      let {
        industryId,
        employeeId,
        countryId,
        cidCode,
        cityId,
        currencyId,
        levelId,
        channelId,
        priorityId,
        assignedId,
        name,
        partnerId,
        partnerSaleType,
        partnerSalePercent,
        saleStartDate,
        saleEndDate,
        esTabLishMent,
        ...customerData
      } = createCustomerDto;

      let createData: any = {
        ...customerData,
        user: userId,
      };

      const existingCustomerHasCity = await this.customerRepository.findOne({
        where: {
          name: name,
          city: { id: cityId },
        },
      });

      const existingCustomer = await this.customerRepository.findOne({
        where: {
          name: name,
        },
      });

      if (existingCustomerHasCity || (existingCustomer && !cityId)) {
        throw new Error(
          this.i18n.t('message.customer.company_has_been_created', {
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

      if (cidCode != '') {
        cidCode = String(Number(cidCode)).padStart(CID_MAX_LENGTH, '0');
      }

      if (
        countryId &&
        (await checkExistInRepo(+countryId, this.countryRepository))
      ) {
        createData = {
          ...createData,
          country: +countryId,
        };
        if (cidCode && !(await this.isValidCid(+countryId, cidCode))) {
          throw new BadRequestException(ERROR_CODES.INVALID_CID_CODE);
        } else if (cidCode && (await this.isValidCid(+countryId, cidCode))) {
          createData = {
            ...createData,
            cidCode: cidCode,
          };
        }
      }

      // Check employ request valid, if valid create data
      if (employeeId && (await this.checkEmployee(+employeeId))) {
        createData = {
          ...createData,
          employee: +employeeId,
        };
      }

      if (
        currencyId &&
        (await checkExistInRepo(currencyId, this.currencyRepository))
      ) {
        createData = {
          ...createData,
          currency: +currencyId,
        };
      }
      // Check industry request valid, if valid create data
      if (industryId && (await this.checkIndustry(+industryId))) {
        createData = {
          ...createData,
          industry: +industryId,
        };
      }
      //Check country and city
      if (countryId && cityId && (await this.checkCity(+countryId, +cityId))) {
        createData = {
          ...createData,
          city: cityId,
        };
      }

      if (
        levelId &&
        (await checkExistInRepo(levelId, this.customerLevelRepository))
      ) {
        createData = {
          ...createData,
          level: +levelId,
        };
      }

      if (
        channelId &&
        (await checkExistInRepo(+channelId, this.saleChannelRepository))
      ) {
        createData = {
          ...createData,
          channel: +channelId,
        };
      }

      if (priorityId && priorityId in customerPriority) {
        createData = {
          ...createData,
          priority: Number(priorityId),
        };
      }

      if (
        assignedId &&
        (await checkExistInRepo(assignedId, this.userRepository))
      ) {
        createData = {
          ...createData,
          userAssign: Number(assignedId),
        };
      }

      if (attachment && attachment?.length > 0) {
        const imageAttach = attachment.filter((items: any) =>
          items.mimetype.startsWith('image/'),
        );
        createData = {
          ...createData,
          description: await this.attendDescription(
            imageAttach,
            createCustomerDto.description,
          ),
        };
      }

      const customer = await this.customerRepository.save(createData);

      if (
        partnerId &&
        (await checkExistInRepo(+partnerId, this.partnerRepository))
      ) {
        if (partnerSaleType && Number(partnerSaleType) in partnerSaleOption) {
          const dataCreatePartner: any = {
            partnerCustomer: Number(customer.id),
            partners: Number(partnerId),
            salePercent: partnerSalePercent ? Number(partnerSalePercent) : null,
            saleType: Number(partnerSaleType),
            startDate:
              Number(partnerSaleType) ===
              partnerSaleOption.TOTAL_PAYMENT_BY_PERIOD
                ? saleStartDate
                : null,
            endDate:
              Number(partnerSaleType) ===
              partnerSaleOption.TOTAL_PAYMENT_BY_PERIOD
                ? saleEndDate
                : null,
          };

          await this.partnerCustomerRepository.save(dataCreatePartner);
        }
      }

      if (customer) {
        const newLog: any = {
          object: LogNoteObject.CUSTOMER,
          objectId: Number(customer.id),
          action: LogNoteActions.CREATE,
          user: +userId,
        };
        const lognote = await this.logNoteRepository.save(newLog);

        if (assignedId && assignedId != Number(userId)) {
          NotificationSave(
            this.notificationRepository,
            notificationAction.ASSIGNED,
            lognote.id,
            notificationSeenAction.NOT_SEEN,
            Number(assignedId),
          );
        }

        if (attachment && attachment?.length > 0) {
          let LogNoteImage = [];
          attachment.forEach((item: any) => {
            const logNote: any = {
              object: LogNoteObject.CUSTOMER,
              objectId: Number(customer.id),
              action: item?.mimetype.startsWith('image/')
                ? LogNoteActions.UPLOAD_FILE
                : LogNoteActions.UPLOAD_FILE_RAW,
              user: +userId,
              attachment: item?.filename,
            };

            LogNoteImage.push(logNote);
          });

          await this.logNoteRepository.save(LogNoteImage);
        }
      }

      return {
        message: this.i18n.t('message.status_messages.create_success', {
          lang: lang,
        }),
        data: customer,
      };
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      checkMysqlError(e);
    }
  }

  async attendDescription(array: any, string: string) {
    let regex = /<img src="[^"]*">/g;
    let index = 0;
    let C = string.replace(regex, function (match) {
      let imgLink = renderFilename(array[index].filename);
      index++;
      return '<img src="' + imgLink + '">';
    });
    return C;
  }

  async findAll(pagination: any, req: RequestWithUser) {
    const kind = req.user.kind;
    const userId = req.user.userId;
    try {
      const {
        offset = 0,
        limit = 0,
        keyword,
        chanelId,
        levelId,
        priorityId,
        countryId,
        provinceId,
        userAssign,
        listPriority,
        customerId,
        cid,
      } = pagination;

      const data = this.customerRepository
        .createQueryBuilder('customers')
        .leftJoinAndSelect('customers.channel', 'sale_channels')
        // .leftJoinAndSelect('customers.employee', 'employees')
        //.leftJoinAndSelect('customers.industry', 'industries')
        // .leftJoinAndSelect('customers.currency', 'currencies')
        // .leftJoinAndSelect('partnersCus.partners', 'partners')
        .leftJoinAndSelect('customers.city', 'cities')
        .leftJoinAndSelect('customers.level', 'customer_level')
        .leftJoinAndSelect('customers.country', 'countries')
        .leftJoinAndSelect('customers.userAssign', 'userAssign')
        .leftJoinAndSelect('userAssign.profile', 'profile')
        .leftJoinAndSelect('customers.partners', 'partnersCus')
        .orderBy('customers.updatedAt', 'DESC')
        .skip(offset)
        .take(limit);

      if (kind === ROLE_NAME.SALE_ASSISTANT) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('customers.userAssign = :userId', {
              userId: userId,
            });
          }),
        );
      }

      if (keyword) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('customers.email LIKE :keyword', {
              keyword: `%${keyword}%`,
            })
              .orWhere('customers.name LIKE :keyword', {
                keyword: `%${keyword}%`,
              })
              .orWhere('customers.cidCode LIKE :keyword', {
                keyword: `%${keyword}%`,
              })
              .orWhere('customers.subName LIKE :keyword', {
                keyword: `%${keyword}%`,
              })
          }),
        );
      }

      if (chanelId) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('customers.channel = :chanelId', { chanelId });
          }),
        );
      }

      if (cid) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('customers.cidCode LIKE :cid', {
              cid: `%${cid.match(/\d+/g)?.join('')}%`,
            });
          }),
        );
      }

      if (customerId) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('customers.id = :customerId', {
              customerId: customerId,
            });
          }),
        );
      }

      if (userAssign) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('customers.userAssign = :userAssign', {
              userAssign: userAssign,
            });
          }),
        );
      }

      if (listPriority) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('customers.priority IN (:listPriority)', {
              listPriority: listPriority.split(','),
            });
          }),
        );
      }

      if (levelId) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('customers.level = :levelId', {
              levelId: levelId,
            });
          }),
        );
      }

      if (priorityId) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('customers.priority = :priorityId', {
              priorityId: priorityId,
            });
          }),
        );
      }

      if (countryId) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('customers.country = :countryId', {
              countryId: countryId,
            });
          }),
        );
      }

      if (provinceId) {
        data.andWhere(
          new Brackets((qr) => {
            qr.where('customers.city = :provinceId', {
              provinceId: provinceId,
            });
          }),
        );
      }
      const [customer, count] = await data.getManyAndCount();
      const response = new PaginationResponseWithTotalData<any>(
        customer,
        count,
      );

      return {
        data: response,
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  async findNameAndID(pagination: any, req: RequestWithUser) {
    try {
      const { keyword } = pagination;
      const userId = req.user.userId;
      const kind = req.user.kind;
      let data = [];

      let queryBuilder = this.customerRepository
        .createQueryBuilder('customer')
        .select(['customer.name', 'customer.id']);

      if (kind === ROLE_NAME.SALE_ASSISTANT) {
        queryBuilder = queryBuilder.where({ userAssign: { id: +userId } });
      }

      if (keyword) {
        queryBuilder.andWhere('customer.name LIKE :keyword', {
          keyword: `%${keyword}%`,
        });
      }

      queryBuilder = queryBuilder.take(10);

      data = await queryBuilder.getMany();

      return {
        data: data,
      };
    } catch (error) {
      checkMysqlError(error);
    }
  }

  async mergeCustomer(id: any, body: any, req: RequestWithUser, headers: any) {
    try {
      const lang = headers.lang;
      const idCustomer = body?.id;
      const kind = req.user.kind;
      const userId = req.user.userId;

      const customerMerge = await this.customerRepository.findOne({
        where: {
          id: idCustomer,
        },
        relations: {
          city: true,
          country: true,
          userAssign: true,
          channel: true,
          level: true,
        },
      });

      const customer = await this.customerRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          city: true,
          country: true,
          userAssign: true,
          channel: true,
          level: true,
        },
      });

      if (!customer || !customerMerge) {
        throw new NotFoundException(
          this.i18n.t('message.status_messages.not_found', { lang: lang }),
        );
      }

      if (
        kind === ROLE_NAME.SALE_ASSISTANT &&
        Number(userId) !== Number(customer?.userAssign?.id)
      ) {
        throw new UnauthorizedException();
      }

      const result = replaceCustomerProperties(customer, customerMerge);

      // Merge info
      // for (let key in customer) {
      //   if (!customer.hasOwnProperty(key) || customer[key] === '') {
      //     customer[key] = customerMerge[key];
      //   }
      // }

      await Promise.all([
        this.dealRepository.update(
          { customer: { id: idCustomer } },
          { customer: { id: id } },
        ),
        this.orderRepository.update(
          { customer: { id: idCustomer } },
          { customer: { id: id } },
        ),
        this.invoiceRepository.update(
          { user: { id: idCustomer } },
          { user: { id: id } },
        ),
        this.paymentRepository.update(
          { customer: { id: idCustomer } },
          { customer: { id: id } },
        ),
        this.taskRepository.update(
          { customer: { id: idCustomer } },
          { customer: { id: id } },
        ),
        this.contactRepository.update(
          { customer: { id: idCustomer } },
          { customer: { id: id } },
        ),
        this.partnerCustomerRepository.update(
          { partnerCustomer: { id: idCustomer } },
          { partnerCustomer: { id: id } },
        ),
        this.customerRepository.save(result),
        this.customerRepository.softDelete(idCustomer),
      ]);

      return {
        data: customer,
        messager: this.i18n.t(
          'message.status_messages.merge_customer_success',
          { lang: lang },
        ),
      };
    } catch (error) {
      throw new Error();
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
    let { offset = 0, limit = DEFAULT_LIMIT_PAGINATE } = pagination;
    try {
      if (id && !(await checkExistInRepo(id, this.customerRepository)))
        throw new NotFoundException();
      const data = await this.customerRepository.findOne({
        relations: {
          industry: true,
          employee: true,
          country: true,
          city: true,
          currency: true,
          level: true,
          channel: true,
          userAssign: {
            profile: true,
          },
          partners: {
            partners: true,
          },
        },
        where: [{ id }],
      });

      if (
        kind === ROLE_NAME.SALE_ASSISTANT &&
        Number(userId) !== Number(data?.userAssign?.id)
      ) {
        throw new NotFoundException();
      }

      const response = await getLogNotes(
        this.logNoteRepository,
        id,
        LogNoteObject.CUSTOMER,
        offset,
        limit,
      );

      return {
        data,
        logNote: transformLogNote(response, lang, this.i18n),
      };
    } catch (e) {
      throw e;
    }
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
    req: RequestWithUser,
    Headers,
  ) {
    const lang = Headers.lang;
    try {
      const customer = await this.customerRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          city: true,
          country: true,
          userAssign: true,
          channel: true,
        },
      });

      const userId = req.user.userId;
      const kind = req.user.kind;

      if (
        kind === ROLE_NAME.SALE_ASSISTANT &&
        Number(userId) !== Number(customer.userAssign.id)
      ) {
        throw new NotFoundException();
      }
      const userAssignDefault = Number(customer.userAssign?.id) ?? null;
      let {
        industryId,
        employeeId,
        countryId,
        cidCode,
        cityId,
        currencyId,
        levelId,
        channelId,
        priorityId,
        assignedId,
        name,
        partnerId,
        partnerSaleType,
        partnerSalePercent,
        saleStartDate,
        saleEndDate,
        ...customerData
      } = updateCustomerDto;
      // let tagIds = [];
      let updateData: any = {
        ...customerData,
      };

      delete updateData.lang;

      delete updateData.partners;

      if (
        customer.name !== name ||
        (cityId && +customer?.city?.id !== cityId)
      ) {
        const existingCustomer = await this.customerRepository.findOne({
          where: {
            name: name,
            city: { id: cityId },
          },
        });

        if (existingCustomer || (existingCustomer && !cityId)) {
          throw new Error(
            this.i18n.t('message.customer.company_has_been_created', {
              lang: lang,
              args: { name: name },
            }),
          );
        }
      }

      if (name) {
        updateData = {
          ...updateData,
          name: name,
        };
      }

      if (
        countryId &&
        (await checkExistInRepo(+countryId, this.countryRepository)) &&
        countryId != customer.country?.id
      ) {
        updateData = {
          ...updateData,
          country: +countryId,
          city: cityId ? +cityId : null,
        };
      }

      const customerCidCode = customer.cidCode ?? null;
      if (customerCidCode) {
        if (cidCode == '') {
          updateData = {
            ...updateData,
            cidCode: null,
          };
        }

        if (cidCode != '') {
          if (
            String(Number(cidCode)).padStart(CID_MAX_LENGTH, '0') !=
            customerCidCode
          ) {
            if (await this.isValidCid(+countryId, cidCode)) {
              updateData = {
                ...updateData,
                cidCode: cidCode.padStart(CID_MAX_LENGTH, '0'),
              };
            } else {
              throw new BadRequestException(ERROR_CODES.INVALID_CID_CODE);
            }
          }
        }
      } else {
        if (cidCode != '') {
          if (await this.isValidCid(+countryId, cidCode)) {
            updateData = {
              ...updateData,
              cidCode: cidCode.padStart(CID_MAX_LENGTH, '0'),
            };
          } else {
            throw new BadRequestException(ERROR_CODES.INVALID_CID_CODE);
          }
        }
      }

      if (employeeId && (await this.checkEmployee(+employeeId))) {
        // Check employ request valid, if valid create data
        updateData = {
          ...updateData,
          employee: +employeeId,
        };
      }

      // Check industry request valid, if valid create data
      if (industryId && (await this.checkIndustry(+industryId))) {
        updateData = {
          ...updateData,
          industry: +industryId,
        };
      }

      if (
        currencyId &&
        (await checkExistInRepo(currencyId, this.currencyRepository))
      ) {
        updateData = {
          ...updateData,
          currency: +currencyId,
        };
      }

      //Check city
      if (cityId) {
        updateData = {
          ...updateData,
          city: cityId,
        };
      }

      if (
        levelId &&
        (await checkExistInRepo(levelId, this.customerLevelRepository))
      ) {
        updateData = {
          ...updateData,
          level: +levelId,
        };
      }

      if (
        channelId &&
        (await checkExistInRepo(channelId, this.saleChannelRepository)) &&
        channelId != customer.channel?.id
      ) {
        updateData = {
          ...updateData,
          channel: +channelId,
        };
      }

      if (priorityId && priorityId in customerPriority) {
        updateData = {
          ...updateData,
          priority: Number(priorityId),
        };
      }

      if (
        assignedId &&
        (await checkExistInRepo(assignedId, this.userRepository))
      ) {
        updateData = {
          ...updateData,
          userAssign: Number(assignedId),
        };
      }

      const beforeUpdateData = JSON.stringify(customer);

      const UpdatedCustomer = await this.customerRepository.update(id, {
        ...customer,
        ...updateData,
        updatedAt: moment(new Date()).format(FOMAT_DATE_TIME),
      });

      if (
        partnerId &&
        (await checkExistInRepo(+partnerId, this.partnerRepository))
      ) {
        if (partnerSaleType && Number(partnerSaleType) in partnerSaleOption) {
          const dataUpdatePartner: any = {
            partnerCustomer: Number(customer.id),
            partners: Number(partnerId),
            salePercent: partnerSalePercent
              ? Number(partnerSalePercent.toString().replace(/,/g, ''))
              : null,
            saleType: Number(partnerSaleType),
            startDate:
              Number(partnerSaleType) ===
              partnerSaleOption.TOTAL_PAYMENT_BY_PERIOD
                ? saleStartDate
                : null,
            endDate:
              Number(partnerSaleType) ===
              partnerSaleOption.TOTAL_PAYMENT_BY_PERIOD
                ? saleEndDate
                : null,
          };

          const dataCustomerPartner =
            await this.partnerCustomerRepository.findOne({
              where: {
                partnerCustomer: {
                  id: +customer?.id,
                },
              },
            });

          if (dataCustomerPartner) {
            await this.partnerCustomerRepository.update(
              dataCustomerPartner?.id,
              {
                ...dataUpdatePartner,
              },
            );
          } else {
            await this.partnerCustomerRepository.save({
              ...dataUpdatePartner,
            });
          }
        }
      }

      const afterUpdatedData = JSON.stringify(customer);

      if (UpdatedCustomer) {
        const newLog: any = {
          object: LogNoteObject.CUSTOMER,
          objectId: Number(customer.id),
          action:
            customer?.description !== updateData?.description
              ? LogNoteActions.CHANGE_DESCRIPTION
              : LogNoteActions.EDIT,
          oldValue: beforeUpdateData,
          newValue: afterUpdatedData,
          user: +userId,
        };
        const lognote = await this.logNoteRepository.save(newLog);

        if (
          assignedId &&
          userAssignDefault !== Number(assignedId) &&
          Number(userId) !== Number(assignedId)
        ) {
          NotificationSave(
            this.notificationRepository,
            notificationAction.ASSIGNED,
            lognote.id,
            notificationSeenAction.NOT_SEEN,
            Number(assignedId),
          );
        }

        if (
          customer?.userAssign &&
          Number(customer?.userAssign?.id) !== Number(userId)
        ) {
          NotificationSave(
            this.notificationRepository,
            notificationAction.EDIT,
            lognote.id,
            notificationSeenAction.NOT_SEEN,
            Number(customer?.userAssign?.id),
          );
        }

        return {
          data: customer,
          message: this.i18n.t('message.status_messages.update_success', {
            lang: lang,
          }),
        };
      }
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      checkMysqlError(e);
    }
  }

  async remove(id: number, Headers) {
    try {
      const lang = Headers.lang;
      const customer = await this.customerRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          deals: true,
          orders: true,
          contacts: true,
          tasks: true,
        },
      });
      if (!customer) {
        throw new NotFoundException(ERROR_CODES.DATA_NOT_FOUND);
      }
      if (
        checkExistNestedData(customer?.deals) ||
        checkExistNestedData(customer?.orders) ||
        checkExistNestedData(customer?.contacts) ||
        checkExistNestedData(customer?.tasks)
      ) {
        throw new BadRequestException(ERROR_CODES.EXISTED_RELATION_DATA);
      }

      const customerPartner = await this.partnerCustomerRepository.find({
        where: {
          partnerCustomer: {
            id: id,
          },
        },
      });

      if (customerPartner?.length > 1) {
        throw new BadRequestException(ERROR_CODES.EXISTED_RELATION_DATA);
      }

      if (customerPartner.length > 0) {
        await this.partnerCustomerRepository.softDelete(customerPartner[0]?.id);
      }

      await this.customerRepository.softDelete(id);

      return {
        data: [],
        message: this.i18n.t('message.status_messages.update_success', {
          lang: lang,
        }),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  private async checkIndustry(industryRequest) {
    const industryId = await this.industryRepository
      .createQueryBuilder('industries')
      .select('industries.id')
      .getMany();

    const industryIdFormatted = industryId.map((value) => +value.id);
    return industryIdFormatted.includes(industryRequest);
  }

  private async checkEmployee(employeeRequest) {
    const employeeId = await this.employeeRepository
      .createQueryBuilder('employees')
      .select('employees.id')
      .getMany();

    const employeeIdFormatted = employeeId.map((v) => +v.id);
    return employeeIdFormatted.includes(employeeRequest);
  }

  private async checkCity(countryRequest: number, cityRequest: number) {
    const city = await this.cityRepository.findOne({
      where: {
        country: {
          id: countryRequest,
        },
        id: cityRequest,
      },
    });
    return cityRequest === +city?.id;
  }

  private async isValidCid(countryRequest: number, cidRequest: string) {
    const convertedCidCode = String(Number(cidRequest)).padStart(
      CID_MAX_LENGTH,
      '0',
    );
    const cidLastInCountry = await this.customerRepository.findOne({
      relations: {
        country: true,
      },
      where: {
        country: {
          id: countryRequest,
        },
        cidCode: convertedCidCode,
      },
    });
    if (cidLastInCountry) {
      const customer = await this.customerRepository.findOne({
        where: {
          cidCode: cidLastInCountry.cidCode,
        },
      });
      if (!customer) {
        return true;
      }
    }

    if (!cidLastInCountry) {
      return true;
    }
    return false;
  }

  async generateCid(countryId: number) {
    try {
      const customer = await this.customerRepository.find({
        relations: {
          country: true,
        },
        where: {
          country: {
            id: countryId,
          },
          cidCode: Not(IsNull()),
        },
      });

      let cidCode: string;
      if (
        customer.length === 0 ||
        customer?.every((item) => item.cid === null)
      ) {
        cidCode = '1'.padStart(CID_MAX_LENGTH, '0');
        return {
          data: { cidCode },
        };
      } else {
        let customerListCidCode = customer.map((item: any) =>
          Number(item?.cidCode),
        );
        customerListCidCode = customerListCidCode.filter((item) =>
          isNumber(item),
        );
        const maxCidCode = Math.max(...customerListCidCode);
        cidCode = String(Number(maxCidCode) + 1).padStart(CID_MAX_LENGTH, '0');
        if (cidCode === '10000') {
          for (let i = 1; i < 9999; i++) {
            if (!customerListCidCode.find((item: number) => item === i)) {
              cidCode = String(i).padStart(CID_MAX_LENGTH, '0');
              break;
            }
            continue;
          }
        }
        return {
          data: { cidCode },
        };
      }
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      checkMysqlError(e);
    }
  }
}

function replaceCustomerProperties<T>(customer1: T | null, customer2: T): T {
  if (!customer1) {
    return customer2;
  }

  for (const key in customer2) {
    if (
      customer1[key] === '' ||
      customer1[key] === null ||
      customer1[key] === undefined
    ) {
      customer1[key] = customer2[key];
    }
  }

  return customer1;
}
