import {  Controller, Get, Param, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { join } from 'path';
import { Observable, of } from 'rxjs';
import { Request } from 'express';
import {
  ATTACHMENT_FORDER,
  ATTACHMENT_FORDER_FILE,
  LOGS_FOLDER,
  SYSTEM_LOGO_FORDER,
  UPLOAD_CARD_VISIT_FORDER,
  UPLOAD_CONTACT_AVATAR_FORDER,
  UPLOAD_PROFILE_IMAGE_FORDER,
} from 'src/constants';
import { ImgStoreService } from './img-store.service';

// @ApiBearerAuth()
// @UseGuards(UserSignedGuard)
@ApiTags('Card-visit-images')
@Controller('api/images')
export class ImgStoreController {
  constructor(
    private imageService: ImgStoreService,
    ) {}

  @Get('/card-visit/:image')
  async getCardImage(
    @Param('image') image: string,
    @Res() res: any,
    @Req() request: Request
  ) {
    await this.imageService.getImage(image, res, request, UPLOAD_CARD_VISIT_FORDER);
  }

  @Get('/user/:image')
  async getUserImage(
    @Param('image') image: string,
    @Res() res: any,
    @Req() request: Request
  ){
    await this.imageService.getImage(image, res, request, UPLOAD_PROFILE_IMAGE_FORDER);
  }

  @Get('/attachment/:image')
  async getAttachmentImage(
    @Param('image') image: string,
    @Res() res: any,
    @Req() request: Request
  ){
    await this.imageService.getImage(image, res, request, ATTACHMENT_FORDER);
  }

  @Get('/file/:file')
  async getFile(
    @Param('file') file: string,
    @Res() res: any,
    @Req() request: Request
  ) {
    await this.imageService.getImage(file, res, request, ATTACHMENT_FORDER_FILE);
  }

  @Get('/contact-avatar/:image')
  async getContactAvatar(
    @Param('image') image: string,
    @Res() res: any,
    @Req() request: Request
  ){
    await this.imageService.getImage(image, res, request, UPLOAD_CONTACT_AVATAR_FORDER);
  }

  @Get('/logs/:file')
  async getLogFile(
    @Param('file') file: string,
    @Res() res: any,
    @Req() request: Request
  ){
    await this.imageService.getImage(file, res, request, LOGS_FOLDER);
  }


  @Get('/setting/:image')
  getSettingLogo(
    @Param('image') image: string,
    @Res() res: any,
  ): Observable<Object> {
    return of(
      res.sendFile(
        join(process.cwd() + `/${SYSTEM_LOGO_FORDER}/` + image),
      ),
    );
  }
}
