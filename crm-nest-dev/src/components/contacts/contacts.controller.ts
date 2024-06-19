import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Headers,
  UploadedFiles
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ContactService } from './contacts.service';
import { PaginationQuery } from 'src/common/dtos';
import { GetDataWithIdParams } from './contacts.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UserSignedGuard } from 'src/common/guards/user';
import {
  CreateContactByCardDto,
  CreateContactDto,
} from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import {
  CardImageSharpPipe,
  ContactAvatarSharpPipe,
  multerOptions,
  uploadFileRaw,
} from '../../common/uploadImageHelper/file-helper';
import {
  UpdateCardimageDto,
  UpdateContactAvatarDto,
} from './dto/update-cardImage.dto';
import { RequestWithUser } from 'src/common/interfaces';
import { BodyWithMiddleware } from 'src/common/utils/bodyWithMiddleware';

@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@ApiTags('contacts')
@Controller('api/contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @ApiImplicitQuery({
    name: 'keyword',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'customerId',
    required: false,
  })
  @ApiImplicitQuery({
    name: 'phoneNumber',
    required: false,
  })
  @ApiImplicitQuery({
    name: 'genderId',
    required: false,
  })
  @ApiImplicitQuery({
    name: 'email',
    required: false,
  })
  @ApiImplicitQuery({
    name: 'contactName',
    required: false,
  })
  async contactGetList(
    @Query() pagination: PaginationQuery,
    @Query('customerId') customerId: string,
    @Request() req: RequestWithUser,
  ) {
    return await this.contactService.getList(pagination, +customerId, req);
  }

  @Put(':id')
  update(
    @Body() body: UpdateContactDto,
    @Param() params: GetDataWithIdParams,
    @Req() req: RequestWithUser,
    @Headers() headers,
  ) {
    const { id } = params;
    return this.contactService.update(id, body, req, headers);
  }

  @Delete(':id')
  delete(@Param() params: GetDataWithIdParams,  @Headers() headers,) {
    const { id } = params;
    return this.contactService.delete(Number(id), headers);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('attachment[]', 20, uploadFileRaw ))
  async create(
    @BodyWithMiddleware() body: CreateContactDto,
    @UploadedFiles() attachment: Array<Express.Multer.File>,
    @Request() req: RequestWithUser,
    @Headers() headers,
  ) {
    if (attachment) {
      return this.contactService.createNew(body, attachment, req, headers);
    }
    return this.contactService.createNew(body, null, req, headers);
  }

  @Post('/save/card')
  async saveCardContact(@Body() body: CreateContactByCardDto) {
    return this.contactService.saveContactByCard(body);
  }

  @Patch(':id/upload-card-image')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('cardImage', multerOptions))
  async uploadImageCard(
    @Param('id') id: string,
    @Body() body: UpdateCardimageDto,
    @UploadedFile(CardImageSharpPipe) file: any,
    @Req() req: RequestWithUser,
    @Headers() headers,
  ) {
    return this.contactService.uploadContactImage(+id, file, req, headers);
  }

  @Get(':id')
  contactGetDetail(
    @Param() params: GetDataWithIdParams,
    @Query() pagination: PaginationQuery,
    @Headers() headers,
    @Request() req: RequestWithUser
  ) {
    const { id } = params;
    return this.contactService.getDetail(Number(id), pagination, headers, req);
  }

  @Patch(':id/upload-contact-avatar')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  async uploadContactAvatar(
    @Param('id') id: string,
    @Body() body: UpdateContactAvatarDto,
    @UploadedFile(ContactAvatarSharpPipe) file: any,
    @Headers() headers,
  ) {
    return this.contactService.uploadContactAvatar(+id, file, headers);
  }
}
