import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';
import * as sharp from 'sharp';
const fs = require('fs');
import { ATTACHMENT_FORDER, ATTACHMENT_FORDER_FILE, SYSTEM_LOGO_FORDER, UPLOAD_CARD_VISIT_FORDER, UPLOAD_CONTACT_AVATAR_FORDER, UPLOAD_PROFILE_IMAGE_FORDER } from 'src/constants';
import { diskStorage } from 'multer';

@Injectable()
export class CardImageSharpPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(cardImage: Express.Multer.File): Promise<string> {
    if (!cardImage) {
      return;
    }
    const name = 'card-visit';
    const randomName = Array(2)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    const filename = `${name}-${randomName}.webp`;

    const diskStorage = `./${UPLOAD_CARD_VISIT_FORDER}`;
    if (!fs.existsSync(diskStorage)) {
      await fs.mkdirSync(diskStorage, { recursive: true });
    }

    await sharp(cardImage.buffer)
      .resize(1024)
      .webp({ effort: 3 })
      .toFile(path.join(`${UPLOAD_CARD_VISIT_FORDER}/`, filename));

    return filename;
  }
}

@Injectable()
export class ContactAvatarSharpPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(avatar: Express.Multer.File): Promise<string> {
    if (!avatar) {
      return;
    }
    const name = 'contact-avatar';
    const randomName = Array(2)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    const filename = `${name}-${randomName}.webp`;

    const diskStorage = `./${UPLOAD_CONTACT_AVATAR_FORDER}`;
    if (!fs.existsSync(diskStorage)) {
      await fs.mkdirSync(diskStorage, { recursive: true });
    }

    await sharp(avatar.buffer)
      .resize(1024)
      .webp({ effort: 3 })
      .toFile(path.join(`${UPLOAD_CONTACT_AVATAR_FORDER}/`, filename));

    return filename;
  }
}


@Injectable()
export class ProfileImageSharpPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(profileImg: Express.Multer.File): Promise<string> {
    if (!profileImg) {
      return;
    }
    const name = 'profile-user-image';
    const randomName = Array(2)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    const filename = `${name}-${randomName}.webp`;

    const diskStorage = `./${UPLOAD_PROFILE_IMAGE_FORDER}`;
    if (!fs.existsSync(diskStorage)) {
      await fs.mkdirSync(diskStorage, { recursive: true });
    }

    await sharp(profileImg.buffer)
      .resize(1024)
      .webp({ effort: 3 })
      .toFile(path.join(`${UPLOAD_PROFILE_IMAGE_FORDER}/`, filename));

    return filename;
  }
}

@Injectable()
export class SystemLogoSharp
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(logo: Express.Multer.File): Promise<string> {
    if (!logo) {
      return;
    }
    const name = 'LogoSystem';
    const randomName = Array(2)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    const filename = `${name}-${randomName}.png`;

    const diskStorage = `./${SYSTEM_LOGO_FORDER}`;
    if (!fs.existsSync(diskStorage)) {
      await fs.mkdirSync(diskStorage, { recursive: true });
    }

    await sharp(logo.buffer)
      .resize(228, 61, { fit: sharp.fit.cover })
      .toFile(path.join(`${SYSTEM_LOGO_FORDER}/`, filename));

    return filename;
  }
}

@Injectable()
export class AttachmentImageSharpPipe implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(attachment: Express.Multer.File, metadata: ArgumentMetadata): Promise<string> {
    if (!attachment) return;
    const name = 'attachment';
    const randomName = Array(2)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    const filename = `${name}-${randomName}.webp`;

    const diskStorage = `./${ATTACHMENT_FORDER}`
    if (!fs.existsSync(diskStorage)) {
      await fs.mkdirSync(diskStorage, { recursive: true })
    }

    await sharp(attachment.buffer)
      .resize(1024)
      .webp({ effort: 3 })
      .toFile(path.join(`${ATTACHMENT_FORDER}/`, filename));

    return filename;
  }
}

@Injectable()
export class AttachmentImagePaymentsPipe implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(value: Express.Multer.File, metadata: ArgumentMetadata): Promise<string> {
    if (!value) return;
    const filename = value?.originalname;
    const diskStorage = `./${ATTACHMENT_FORDER}`
    if (!fs.existsSync(diskStorage)) {
      await fs.mkdirSync(diskStorage, { recursive: true });
    }

    await sharp(value.buffer).toFile(path.join(`${diskStorage}/`, filename));
    return filename;
  }
}

const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!file?.originalname?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed'));
  }
  callback(null, true);
};

const fileRawFilter = (req: any, file:any, callback:any) => {
  if (!file?.originalname?.toLowerCase().match(/\.(pdf|doc|docx|xls|pptx|xlsx|jpeg|png|jpg)$/)) {
    return callback(new HttpException('Only files type: pdf, doc, docx, xls, pptx, xlsx, png , jpg, jpeg are allowed', HttpStatus.BAD_REQUEST), false);
  }
  callback(null, true);
}

export const multerOptions = {
  fileFilter: imageFileFilter,
  limits: { fileSize: 20971520 },
};


export const uploadFileRaw = {
  fileFilter:fileRawFilter,
  limits: { fileSize: 104857600 },
  storage: diskStorage ({
      destination: `./${ATTACHMENT_FORDER_FILE}`,
      filename:async (req, file, callback) => {
          const name = decodeURIComponent((file?.originalname).split(".")[0]);
          const randomName = Array(2)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          const type = (file?.originalname).split(".")[1];
          let filename;
          const filetype = "png, jpeg, jpg";
          if(filetype.includes(type)) {
            filename = `${name}-${randomName}.webp`;
          } else {
            filename = `${name}-${randomName}.${type}`;
          }
          const diskStorage2 = `./${ATTACHMENT_FORDER_FILE}`
          if (!fs.existsSync(diskStorage2)) {
            await fs.mkdirSync(diskStorage2, { recursive: true })
          }
          callback(null, filename)
      }
  })
}


export const uploadFileRawMuti = (req, file, callback) => {
  let ext = path.extname(file.originalname);
  if (ext !== '.png') {
    req.fileValidationError = 'Invalid file type';
    return callback(new Error('Invalid file type'), false);
  }
  return callback(null, true);
};


export const uploadFileRawTesting = {
  fileFilter:uploadFileRawMuti,
  limits: { fileSize: 104857600 },
  storage: diskStorage ({
      destination: `./${ATTACHMENT_FORDER_FILE}`,
      filename:async (req, file, callback) => {
          const name = decodeURIComponent((file?.originalname).split(".")[0]);
          const randomName = Array(2)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          const type = (file?.originalname).split(".")[1];
          let filename;
          const filetype = "png, jpeg, jpg";
          if(filetype.includes(type)) {
            filename = `${name}-${randomName}.webp`;
          } else {
            filename = `${name}-${randomName}.${type}`;
          }
          const diskStorage2 = `./${ATTACHMENT_FORDER_FILE}`
          if (!fs.existsSync(diskStorage2)) {
            await fs.mkdirSync(diskStorage2, { recursive: true })
          }
          callback(null, filename)
      }
  })
}
