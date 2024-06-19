import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Req,
  UseInterceptors,
  UploadedFile,
  Query,
  Headers
} from '@nestjs/common';
import { LogNotesService } from './log-notes.service';
import { CreateLogNoteDto } from './dto/create-log-note.dto';
import { UploadFileDto, UploadFileRawDto } from './dto/upload-file-log-note.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserSignedGuard } from 'src/common/guards/user';
import { RequestWithUser } from 'src/common/interfaces';
import { UpdateLogNoteDto } from './dto/update-log-note.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  AttachmentImageSharpPipe,
  multerOptions,
  uploadFileRaw,
} from 'src/common/uploadImageHelper/file-helper';
import {PaginationQueryLogNote } from 'src/common/dtos';

@ApiTags('Log Notes')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
@Controller('api')
export class LogNotesController {
  constructor(private readonly logNotesService: LogNotesService) {}

  @Post('/comments')
  create(
    @Body() createLogNoteDto: CreateLogNoteDto,
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.logNotesService.create(createLogNoteDto, req);
  }

  @Post('/upload-file')
  @UseInterceptors(FileInterceptor('attachment', multerOptions))
  @ApiBearerAuth()
  @UseGuards(UserSignedGuard)
  @ApiConsumes('multipart/form-data')
  uploadFile (
    @Body() uploadFileDto: UploadFileDto,
    @Req() req: RequestWithUser,
    @UploadedFile(AttachmentImageSharpPipe) attachment: Express.Multer.File
  ) {
    return this.logNotesService.uploadFile(uploadFileDto, req, attachment)
  }

  @Post('/upload-file-raw')
  @UseInterceptors(FileInterceptor('attachment', uploadFileRaw))
  @ApiBearerAuth()
  @UseGuards(UserSignedGuard)
  @ApiConsumes('multipart/form-data')
  uploadFileRaw (
    @Body() uploadFileDto: UploadFileRawDto,
    @Req() req: RequestWithUser,
    @UploadedFile() attachment: Express.Multer.File
  )
   {
    return this.logNotesService.uploadFileRaw(uploadFileDto, req, attachment);
  }

  @Put('/comments/:id')
  update(
    @Param('id') id: string,
    @Body() UpdateLogNoteDto: UpdateLogNoteDto,
    @Req() req: RequestWithUser,
  ) {
    return this.logNotesService.update(+id, UpdateLogNoteDto, req);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.logNotesService.delete(+id);
  }

  @Get('/lognote')
  findAll(
    @Query() pagination: PaginationQueryLogNote ,
    @Headers() headers: any,
    @Req() req: RequestWithUser,
    ) {
    return this.logNotesService.findAll(pagination,headers, req);
  }
}
