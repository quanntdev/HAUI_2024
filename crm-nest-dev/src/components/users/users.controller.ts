import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PaginationQuery, PaginationResponse } from 'src/common/dtos';
import { GetDataWithIdParams } from './dtos/users.dto';
import { UsersService } from './users.service';
import { CreateNewUser } from './dtos/users.dto';
import { UpdateUsers } from './dtos/update-users.dto';
import { AdminGuard, UserSignedGuard } from 'src/common/guards/user';
import { RequestWithUser } from 'src/common/interfaces/user';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { UpdateMyProfileDto } from './dtos/update-my-profile.dto.user';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  multerOptions,
  ProfileImageSharpPipe,
} from 'src/common/uploadImageHelper/file-helper';
import { UpdateMyPassword } from './dtos/update-my-password.dto';
import { UpdateLanguages } from './dtos/update-languagues.dto';

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiBearerAuth()
  @Get()
  @UseGuards(UserSignedGuard)
  @ApiImplicitQuery({
    name: 'keyword',
    required: false,
    type: String,
  })
  async userGetList(@Query() pagination: PaginationQuery, @Request() req: any) {
    const authId = req.user.userId;
    const [users, count] = await this.userService.getListUser(
      pagination,
      Number(authId),
    );
    return new PaginationResponse<any>(users, count);
  }

  @ApiBearerAuth()
  @UseGuards(UserSignedGuard)
  @Get('my-profile')
  getMyProfile(@Req() request: RequestWithUser, @Headers() headers,) {
    const authUserID = request.user.userId;
    return this.userService.getMyProfile(Number(authUserID),headers);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete(':id')
  delete(
    @Param() params: GetDataWithIdParams,
    @Request() req,
    @Headers() headers,
  ) {
    const { id } = params;
    const authId = req.user.userId;
    return this.userService.delete(Number(id), Number(authId), headers);
  }

  @ApiBearerAuth()
  @UseGuards(UserSignedGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profileImg', multerOptions))
  @Patch('update-my-profile')
  updateProfile(
    @Req() req: RequestWithUser,
    @Body() body: UpdateMyProfileDto,
    @UploadedFile(ProfileImageSharpPipe) file: any,
    @Headers() headers,
  ) {
    return this.userService.updateUserProfile(req, body, file,headers);
  }

  @ApiBearerAuth()
  @UseGuards(UserSignedGuard)
  @Patch('update-user-languages')
  uploadLanguages(
    @Req() req,
    @Body() body: UpdateLanguages,
    @Headers() headers,
  ) {
    return this.userService.uploadUserLangues(req, body, headers);
  }

  @ApiBearerAuth()
  @UseGuards(UserSignedGuard)
  @Patch('update-my-password')
  updatePassword(@Req() req: RequestWithUser, @Body() body: UpdateMyPassword, @Headers() headers,) {
    return this.userService.updateMyPassword(req, body,headers);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post()
  create(@Body() body: CreateNewUser, @Headers() Headers) {
    return this.userService.create(body, Headers);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Put(':id')
  update(
    @Req() request: RequestWithUser,
    @Body() body: UpdateUsers,
    @Param('id') id: string,
    @Headers() headers,
  ) {
    const authUser = request.user;
    return this.userService.update(+id, body, authUser,headers);
  }
}
