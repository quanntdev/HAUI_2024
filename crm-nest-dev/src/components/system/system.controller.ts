import { SystemService } from './system.service';
import { Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors, Headers, Get} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserSignedGuard } from 'src/common/guards/user';
import { SystemSetting } from './dto/create-system.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions, SystemLogoSharp } from 'src/common/uploadImageHelper/file-helper';
import { RequestWithUser } from 'src/common/interfaces';

@ApiTags('System')
@Controller('api/system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(UserSignedGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo', multerOptions))
  create(
    @Body() body:SystemSetting,
    @UploadedFile(SystemLogoSharp) file: any,
    @Req() req: RequestWithUser,
    @Headers() headers,
    ) {
    return this.systemService.create(body, file, req, headers);
  }

  @Get()
  getDetail() {
    return this.systemService.getDetails();
  }
}
