import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import config from '../../config';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';

import { IsNull, Not, Repository } from 'typeorm';
import { Contact, Profile } from 'src/entities';
import {
  UPLOAD_PROFILE_IMAGE_FORDER,
  UPLOAD_CARD_VISIT_FORDER,
} from 'src/constants';
import { join } from 'path';
var fss = require('fs');

var fs = require('fs').promises;

@Injectable()
export class CronImgService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_11PM, {
    name: 'cleanContactCardImg',
    timeZone: config.TIME_ZONE ?? 'Asia/Ho_Chi_Minh',
  })
  async clearContactCardImg(handlebyRequest: boolean) {
    try {
      var files = await fss.readdirSync(
        join(process.cwd() + `/${UPLOAD_CARD_VISIT_FORDER}/`),
      );
      const contactList = await this.contactRepository.find({
        where: {
          cardImage: Not(IsNull()),
        },
        select: { cardImage: true },
      });
      const contactListImg = contactList?.map((item) => item.cardImage);
      const deleteItemList = [];
      files.forEach((file: any) => {
        if (!contactListImg.find((item) => item === file)) {
          deleteItemList.push(file);
        }
      });

      if (deleteItemList.length > 0) {
        await Promise.all(
          deleteItemList.map(
            async (item): Promise<any> =>
              await fs.unlink(
                join(process.cwd() + `/${UPLOAD_CARD_VISIT_FORDER}/` + item),
              ),
          ),
        );
      }
    } catch (e) {
      checkMysqlError(e);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'cleanProfileImg',
    timeZone: config.TIME_ZONE ?? 'Asia/Ho_Chi_Minh',
  })
  async clearProfileImg(handlebyRequest: boolean) {
    try {
      var files = await fss.readdirSync(
        join(process.cwd() + `/${UPLOAD_PROFILE_IMAGE_FORDER}/`),
      );
      const profileList = await this.profileRepository.find({
        where: {
          profileImg: Not(IsNull()),
        },
        select: { profileImg: true },
      });
      const profileListImg = profileList?.map((item) => item.profileImg);
      const deleteItemList = [];
      files.forEach((file: any) => {
        if (!profileListImg.find((item) => item === file)) {
          deleteItemList.push(file);
        }
      });
      if (deleteItemList.length > 0) {
        await Promise.all(
          deleteItemList.map(
            async (item): Promise<any> =>
              await fs.unlink(
                join(process.cwd() + `/${UPLOAD_PROFILE_IMAGE_FORDER}/` + item),
              ),
          ),
        );
      }
    } catch (e) {
      checkMysqlError(e);
    }
  }
}
