import { System } from './../../entities/system.entity';
import {ROLE_NAME } from './../../constants/auth';
import { RequestWithUser } from 'src/common/interfaces';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SystemSetting } from './dto/create-system.dto';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SystemService {
   constructor(
    @InjectRepository(System)
    private readonly systemRepository: Repository<System>,

    private i18n: I18nService<I18nTranslations>,
  ) {}

  async create(body:SystemSetting, file:any, req: RequestWithUser, headers) {
    try {
     const lang = headers.lang;
     let data:any;
     if(req.user.kind !== ROLE_NAME.ADMIN){throw new BadRequestException(this.i18n.t('message.status_messages.unauthorized', {lang: lang,}))}
     const system = await this.systemRepository.findOne({where: {id: null}});
     if(system) {
        system.logo = file;
        data =  await this.systemRepository.save(system)
     } else {
        data =  await this.systemRepository.save({
         logo: file
        })
     }

     return {
        data: data,
        message: this.i18n.t('message.status_messages.create_success', {
          lang: lang,
        }),
      };
    } catch(e) {
      checkMysqlError(e)
    }
  }

  async getDetails() {
    try {
     const system = await this.systemRepository.findOne({where: {id: null}});
     return {
        data: system,
      };
    } catch(e) {
      checkMysqlError(e)
    }
  }
}
