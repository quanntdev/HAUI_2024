import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';
import {
  DEFAULT_LIMIT_PAGINATE,
  ROLE_NAME,
  UPLOAD_CARD_VISIT_FORDER,
  UPLOAD_CONTACT_AVATAR_FORDER,
} from 'src/constants';
import { Brackets, Repository } from 'typeorm';
import { Contact } from '../../entities';
import {
  CreateContactByCardDto,
  CreateContactDto,
} from './dto/create-contact.dto';
import { Customer } from '../../entities/customer.entity';
import { LogNote } from 'src/entities';
import {
  PaginationQuery,
  PaginationResponse,
} from '../../common/dtos/pagination';
import { UpdateContactDto } from './dto/update-contact.dto';
import * as AWS from 'aws-sdk';
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const fs = require('fs').promises;
import { join } from 'path';
import {
  conditionCheckCompany,
  regexPhoneNumber,
  extractEmails,
} from '../../constants';
import { getLogNotes, transformLogNote } from 'src/common/utils/queryLogNotes';
import { LogNoteObject } from '../log-notes/enum/log-note-object.enum';
import { LogNoteActions } from '../log-notes/enum/log-note-actions.enum';
import { RequestWithUser } from 'src/common/interfaces';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { attendDescription } from 'src/common/utils/attendDes';

interface Entities {
  Type: string;
  Text: string;
}

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(LogNote)
    private readonly logNoteRepository: Repository<LogNote>,

    private i18n: I18nService<I18nTranslations>
  ) {}

  public async getList(pagination: any, customerId: number, req : RequestWithUser) {
    try {
      const {
        offset = 0,
        limit = DEFAULT_LIMIT_PAGINATE,
        keyword,
        phoneNumber,
        genderId,
        email,
        contactName,
      } = pagination;

      const kind = req.user.kind;
      const userId = Number(req.user.userId)
      const query = this.contactRepository
        .createQueryBuilder('contacts')
        .orderBy('contacts.id', 'DESC')
        .leftJoinAndSelect('contacts.customer', 'companies')
        .leftJoinAndSelect('companies.userAssign', 'userAssign')
        .orderBy('contacts.id', 'DESC')
        .skip(offset)
        .take(limit);

      if(kind === ROLE_NAME.SALE_ASSISTANT) {
        query.andWhere(
          new Brackets((qr) => {
            qr.where('userAssign.id = :userId', {
              userId: userId,
            });
          }),
        );
      }

      if (keyword) {
        query.andWhere(
          new Brackets((qr) => {
            qr.where('contacts.email LIKE :keyword', {
              keyword: `%${keyword}%`,
            })
              .orWhere(
                "CONCAT(contacts.firstName, ' ', contacts.lastName) LIKE :keyword",
                {
                  keyword: `%${keyword}%`,
                },
              )
              .orWhere('companies.name LIKE :keyword', {
                keyword: `%${keyword}%`,
              });
          }),
        );
      }

      if (customerId) {
        query.andWhere(
          new Brackets((q) => {
            q.where('contacts.customer_id = :customerId', { customerId });
          }),
        );
      }

      if (phoneNumber) {
        query.andWhere(
          new Brackets((q) => {
            q.where('contacts.phone LIKE :phoneNumber', {
              phoneNumber: `%${phoneNumber}%`,
            });
          }),
        );
      }

      if (contactName) {
        query.andWhere(
          new Brackets((q) => {
            q.where(
              'contacts.first_name LIKE :contactName OR contacts.last_name LIKE :contactName',
              {
                contactName: `%${contactName}%`,
              },
            );
          }),
        );
      }

      if (email) {
        query.andWhere(
          new Brackets((q) => {
            q.where('contacts.email LIKE :email', {
              email: `%${email}%`,
            });
          }),
        );
      }

      if (genderId) {
        query.andWhere(
          new Brackets((q) => {
            q.where('contacts.gender = :genderId', {
              genderId: Number(genderId),
            });
          }),
        );
      }

      const [contact, count] = await query.getManyAndCount();
      const data = new PaginationResponse<any>(contact, count);

      return {
        data,
      };
    } catch (error) {
      checkMysqlError(error);
    }
  }

  public async findByCustomerId(id: number, pagination: PaginationQuery) {
    try {
      const {
        offset = 0,
        limit = DEFAULT_LIMIT_PAGINATE,
      } = pagination;
      const query = this.contactRepository
        .createQueryBuilder('contacts')
        .andWhere(
          new Brackets((qr) => {
            qr.where('contacts.customer_id = :customerId', {
              customerId: `${id}`,
            });
          }),
        )
        .orderBy('contacts.createdAt', 'DESC')
        .skip(offset)
        .take(limit);

      const [contacts, count] = await query.getManyAndCount();
      return {
        data: new PaginationResponse<any>(contacts, count),
      };
    } catch (e) {
      checkMysqlError(e);
    }
  }

  public async getDetail(id: number, pagination: PaginationQuery, Headers:any, req: RequestWithUser) {
    const lang = Headers.lang
    let { offset = 0, limit = DEFAULT_LIMIT_PAGINATE } = pagination;
    const kind = req.user.kind;
    const userId = Number(req.user.userId)

    const contact = await this.contactRepository.findOne({
      where: { id },
      relations: {
        customer: {
          userAssign: true
        }
      },
    });

    if(kind === ROLE_NAME.SALE_ASSISTANT && contact.customer &&  userId !== Number(contact.customer.userAssign.id)) {
      throw new NotFoundException();
    }
 
    const response = await getLogNotes(
      this.logNoteRepository,
      id,
      LogNoteObject.CONTACT,
      offset,
      limit,
    );

    if (!contact) {
      throw new NotFoundException(
        this.i18n.t('message.status_messages.contact_not_found', {lang: lang})
      );
    }
    return {
      data: contact,
      logNote: transformLogNote(response, lang, this.i18n),
    };
  }

  public getDataNameNlp(data: any, findName?: Array<string>, key?: string) {
    return data?.Entities?.filter((name: Entities) => {
      if (name.Type === key && findName) {
        if (
          (findName?.length && findName.includes(name.Type)) ||
          !findName?.length
        )
          return name;
      }
      return name.Type === key;
    }).map((x: Entities) => x.Text);
  }

  public async saveContactByCard(body: CreateContactByCardDto) {
    try {
      const { text, lang, device } = body;
      const comprehend = new AWS.Comprehend({
        apiVersion: '2017-27-11',
      });
      let findName: Array<string> = [];
      let inputStr = text.split(/\r?\n/);
      const convertStr = inputStr.map((x: string) =>
        x
          .split(' ')
          .map((str: string) => {
            if (str === str.toUpperCase()) {
              const newStr = str.charAt(0) + str.slice(1).toLowerCase();
              findName.push(newStr);
              return newStr;
            }
            return str;
          })
          ?.join(' '),
      );
      const params = {
        LanguageCode: lang || 'ja',
        Text: convertStr?.join(' '),
      };
      const res = await comprehend.detectEntities(params).promise();
      const newContact: any = {
        firstName: this.getDataNameNlp(res, findName, 'PERSON')?.[0],
        lastName: this.getDataNameNlp(res, findName, 'PERSON')?.[
          this.getDataNameNlp(res, findName, 'PERSON')?.length - 1
        ],
        // address: this.getDataNameNlp(res, [], 'LOCATION')?.join(" "),
        company:
          this.getDataNameNlp(res, [], 'ORGANIZATION')?.join(' ') ||
          convertStr?.find((x: string) =>
            new RegExp(conditionCheckCompany.join('|')).test(x),
          ),
        phone: text.match(regexPhoneNumber).map((s: any) => s.trim())?.[0],
        email: extractEmails(convertStr?.join(' '))?.[0],
      };
      return {
        data: newContact,
      };
    } catch (err) {
      throw err;
    }
  }

  public async createNew(
    body: CreateContactDto,
    attachment: any,
    req: RequestWithUser,
    Headers
  ) {
    try {
      const userId = Number(req.user.userId);
      const { customerId, ...restCreateDto } = body;
      const lang = Headers.lang
      let createDto: any = restCreateDto;
      if (customerId && (await this.checkCustomer(+customerId))) {
        createDto = {
          ...createDto,
          customer: +customerId,
        };
      }

      createDto = {
        ...createDto,
        email: body.email ? body.email : null,
        gender: body.gender ? body.gender : null,
        phone: body.phone ? body.phone : null
      }

      if (attachment && attachment?.length > 0) {
        const imageAttach = attachment.filter((items: any) =>
          items.mimetype.startsWith('image/'),
        );

        const fileAttach = attachment.filter((items: any) =>
          !items.mimetype.startsWith('image/'),
        );
        createDto = {
          ...createDto,
          description: await attendDescription(
            imageAttach,
            fileAttach,
            body.description,
          ),
        };
      }

      const result: Contact = await this.contactRepository.save(createDto);
      if (result) {
        let LogNoteImage = [];
        const newLog: any = {
          object: LogNoteObject.CONTACT,
          objectId: Number(result.id),
          action: LogNoteActions.CREATE,
          user: +userId,
        };

        LogNoteImage.push(newLog);

        if(attachment) {
          attachment.forEach((item: any) => {
            const logNote: any = {
              object: LogNoteObject.CONTACT,
              objectId: Number(result.id),
              action: item?.mimetype.startsWith('image/')
                ? LogNoteActions.UPLOAD_FILE
                : LogNoteActions.UPLOAD_FILE_RAW,
              user: +userId,
              attachment: item?.filename,
            };
            LogNoteImage.push(logNote);
          });
        }

        await this.logNoteRepository.save(LogNoteImage);
      }

      return {
        data: result,
        message: this.i18n.t('message.status_messages.create_success', {lang: lang}),
      };
    } catch (error) {
      checkMysqlError(error);
    }
  }

  public async uploadContactImage(
    id: number,
    filename: string,
    req: RequestWithUser,
    Headers
  ) {
    try {
      const lang = Headers.lang
      const userId = Number(req.user.userId);
      const contact = await this.contactRepository.findOne({ where: { id } });
      const oldImg = { ...contact };

      if (!contact) {
        await fs.unlink(
          join(process.cwd() + `/${UPLOAD_CARD_VISIT_FORDER}/` + filename),
        );
        throw new NotFoundException(
          this.i18n.t('message.contact.cannot_update_contact', {lang: lang})
        );
      }

      if (contact.cardImage && contact.cardImage !== filename) {
        await fs.unlink(
          join(
            process.cwd() + `/${UPLOAD_CARD_VISIT_FORDER}/` + contact.cardImage,
          ),
        );
      }
      contact.cardImage = filename;

      await this.contactRepository.update(id, contact);

      let newImg: any = await this.contactRepository.findOne({
        where: { id },
      });

      await this.createContactLogNotes(oldImg, newImg, +userId);

      return {
        data: contact,
        message: this.i18n.t('message.status_messages.update_success', {lang: lang}),
      };
    } catch (error) {
      checkMysqlError(error);
    }
  }

  public async uploadContactAvatar(id: number, filename: string, Headers) {
    const lang = Headers.lang
    try {
      const contact = await this.contactRepository.findOne({ where: { id } });
      if (!contact) {
        if (
          join(process.cwd() + `/${UPLOAD_CONTACT_AVATAR_FORDER}/` + filename)
        ) {
          await fs.unlink(
            join(
              process.cwd() + `/${UPLOAD_CONTACT_AVATAR_FORDER}/` + filename,
            ),
          );
        }
        throw new NotFoundException(
          this.i18n.t('message.contact.cannot_update_contact', {lang: lang}),
        );
      }
      if (contact.avatar && contact.avatar !== filename) {
        if (
          join(process.cwd() + `/${UPLOAD_CONTACT_AVATAR_FORDER}/` + filename)
        ) {
          await fs.unlink(
            join(
              process.cwd() +
                `/${UPLOAD_CONTACT_AVATAR_FORDER}/` +
                contact.avatar,
            ),
          );
        }
      }
      contact.avatar = filename;
      await this.contactRepository.update(id, contact);
      return {
        data: contact,
        message: this.i18n.t('message.status_messages.update_success', {lang: lang}),
      };
    } catch (error) {
      checkMysqlError(error);
    }
  }

  public async update(
    id: number,
    body: UpdateContactDto,
    req: RequestWithUser,
    Headers
  ) {
    try {
      const userId = Number(req.user.userId);
      const lang = Headers.lang

      let contact: any = await this.contactRepository.findOne({
        where: { id },
      });

      const oldContact = { ...contact };
      delete contact.lang;

      if (!contact) {
        throw new NotFoundException(
          this.i18n.t('message.status_messages.contact_not_found', {lang: lang})
        );
      }
      const { customerId, ...restUpdateDto } = body;
      let updateDto: any = restUpdateDto;

      // const tagsId = [];

      if (customerId && (await this.checkCustomer(+customerId))) {
        updateDto = {
          ...updateDto,
          customer: customerId,
        };
      }

      // Delete tag in relationship
      // if (!tagId || (await this.checkTag(tagId))) {
      //   contact.tags = [];
      //   // await this.contactRepository.save(contact);
      // }

      // if (tagId && (await this.checkTag(tagId))) {
      //   tagId.split(',').forEach((value) => {
      //     const tag = new Tag();
      //     tag.id = +value;
      //     tagsId.push(tag);
      //   });

      //   contact.tags = tagsId;
      // }
      delete updateDto.lang;
      Object.assign(contact, updateDto);
      await this.contactRepository.update(id, {
        ...contact,
      });

      let newContact: any = await this.contactRepository.findOne({
        where: { id },
      });

      if (newContact) {
        await this.createContactLogNotes(oldContact, newContact, +userId);
      }

      return {
        data: contact,
        message: this.i18n.t('message.status_messages.update_success', {lang: lang}),
      };
    } catch (error) {
      checkMysqlError(error);
    }
  }

  public async delete(id: number, Headers) {
    try {
      const lang = Headers.lang
      const contact = await this.contactRepository.findOne({ where: { id } });
      if (!contact) {
        throw new NotFoundException(
          this.i18n.t('message.status_messages.contact_not_found', {lang: lang}),
        );
      }
      if (contact.cardImage) {
        await fs.unlink(
          join(
            process.cwd() + `/${UPLOAD_CARD_VISIT_FORDER}/` + contact.cardImage,
          ),
        );
      }
      await this.contactRepository.softDelete(id);
      return {
        data: [],
        message: this.i18n.t('message.status_messages.delete_success', {lang: lang}),
      };
    } catch (error) {
      checkMysqlError(error);
    }
  }

  async createContactLogNotes(before: any, after: any, userId: number) {
    const compareList = [
      'firstName',
      'lastName',
      'gender',
      'email',
      'phone',
      'description',
      'cardImage',
    ];
    compareList?.forEach(async (item: string) => {
      if (JSON.stringify(before[item]) != JSON.stringify(after[item])) {
        let action: number;
        switch (item) {
          case 'firstName':
            action = LogNoteActions.CHANGE_NAME;
            break;
          case 'lastName':
            action = LogNoteActions.CHANGE_NAME;
            break;
          case 'gender':
            action = LogNoteActions.CHANGE_GENDER;
            break;
          case 'email':
            action = LogNoteActions.CHANGE_EMAIL;
            break;
          case 'phone':
            action = LogNoteActions.CHANGE_PHONE;
            break;
          case 'description':
            action = LogNoteActions.CHANGE_DESCRIPTION;
            break;
          case 'cardImage':
            action = LogNoteActions.CHANGE_CARD_VISIT;
            break;
        }

        if (action) {
          const newLog: any = {
            object: LogNoteObject.CONTACT,
            objectId: Number(before?.id),
            action,
            oldValue: JSON.stringify(before[item]) ?? '',
            newValue: JSON.stringify(after[item]) ?? '',
            user: userId,
          };
          await this.logNoteRepository.save(newLog);
        }
      }
    });
  }

  // private async checkTag(tagRequest): Promise<boolean> {
  //   const tagId = await this.tagRepository
  //     .createQueryBuilder('tag')
  //     .select('tag.id')
  //     .getMany();
  //   const tagIdFormatted = tagId.map((item) => item.id + '');

  //   return tagRequest.split(',').every((value) => {
  //     return tagIdFormatted.includes(value);
  //   });
  // }

  private async checkCustomer(customerRequest): Promise<boolean> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerRequest },
    });

    return !!customer;
  }
}
