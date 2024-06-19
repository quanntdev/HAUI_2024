import { Controller, Post, UseGuards, Body, Headers, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserSignedGuard } from 'src/common/guards/user';
import { AuthLoginBody, AuthRefreshBody, ForgotPasswordDto, ChangePasswordWithTokenDto } from './auth.dto';
import { AuthService } from './auth.service';
import { PaginationQueryToken } from 'src/common/dtos';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: AuthLoginBody,
    @Headers() Headers,
    ) {
    return await this.authService.login(body, Headers);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
    @Headers() Headers,
    ) {
    return await this.authService.forgotPassword(body);
  }

  @ApiBearerAuth()
  @UseGuards(UserSignedGuard)
  @Post('logout')
  async logout(@Headers() auth) {
    return await this.authService.logout(auth);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshToken: AuthRefreshBody) {
    return await this.authService.refreshToken(refreshToken);
  }

  @Get('check-reset-token')
  getResetToken(
    @Query() pagination: PaginationQueryToken,
    ) {
    return this.authService.checkResetToken(pagination);
  }

  @Post("change-password-with-token")
  changePasswordWithToken(
    @Body() body : ChangePasswordWithTokenDto
    ) {
    return this.authService.changePassword(body);
  }
}
