import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { AuthRefreshBody, ForgotPasswordDto, ChangePasswordWithTokenDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { ERROR_CODES, ROLE, ROLE_NAME } from 'src/constants';
import { SUCCESS_CODES } from 'src/constants/successCodes';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from 'src/entities';
import config from 'src/config';
import { checkMysqlError } from 'src/common/validatorContraints/checkMysqlError';
import { MailService } from '../mail/mail.service';
import { PaginationQueryToken } from 'src/common/dtos';;
const moment = require('moment');

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private adminService: AdminService,
    private mailerService: MailService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async login(user: any, Header): Promise<{ accessToken: string, refreshToken: string, message: string, lang:string }> {
    let decodeToken;
    if (user.code) decodeToken = await this.loginWithSSO(user.code)
    const { email, password, isRemember } = user
    const userDB = await this.adminService.findUser(!decodeToken ? email : decodeToken?.data?.email)

    if (!userDB) throw new BadRequestException(ERROR_CODES.NOT_FOUND)

    if (!(await bcrypt.compare(password, userDB.password)) && !decodeToken) {
      throw new BadRequestException(ERROR_CODES.INVALID_PASSWORD)
    }

    const kind = this.getRoleNameUser(userDB.role)
    const refreshToken = this.createRefreshToken(userDB)
    await this.userRepository.update(userDB.id, {
      refresh_token: refreshToken
    })
    let accessToken = this.createPayload({ email, kind, sub: userDB.id, refreshToken })

    if (isRemember) {
      accessToken = this.createAccessToken(userDB, refreshToken, config.JWT_TOKEN_REMEMBER_EXPIRES)
    }

    let lang = userDB.language

    return {
      accessToken,
      refreshToken,
      lang,
      message: SUCCESS_CODES.LOGIN_SUCCESS,
    };
  }

  async loginWithSSO(code: string) {
      // check valid code
      let decodeToken;
      decodeToken = this.jwtService.decode(code)
      if (Date.now() >= decodeToken?.iat * 1000) throw new BadRequestException(ERROR_CODES.EXPIRED);
      if (!(await bcrypt.compare(`${process.env.CLIENT_ID}_${process.env.SECRET_KEY}`, decodeToken?.data?.code))) throw new BadRequestException(ERROR_CODES.INVALID_TOKEN_DATA);
      return decodeToken;
  }


  async logout(auth: any): Promise<{ message: string }> {
    const author = auth.authorization
    const token = this.getTokenFromHeader(author)
    const decodeToken = this.jwtService.decode(token)
    if (typeof decodeToken === 'string') {
      return {
        message: ERROR_CODES.UNAUTHORIZED
      }
    }

    await this.userRepository.update(
      +(decodeToken.sub),
      {
        refresh_token: null
      }
    )

    return {
      message: SUCCESS_CODES.LOGOUT_SUCCESS
    }
  }

  async refreshToken(token: AuthRefreshBody): Promise<{ accessToken: string, refreshToken: string } | any> {
    const decodeToken = this.jwtService.decode(token.refresh_token)
    if (typeof decodeToken === 'string' || !decodeToken) {
      return {
        message: ERROR_CODES.UNAUTHORIZED
      }
    }

    const user: User = await this.userRepository.findOne({
      where: {
        id: +(decodeToken.sub),
        deleted_at: IsNull()
      }
    });

    if (token.refresh_token !== user.refresh_token) {
      return {
        message: ERROR_CODES.UNAUTHORIZED
      }
    }

    const refreshToken = this.createRefreshToken(user)
    await this.userRepository.update(
      +(decodeToken.sub),
      {
        refresh_token: refreshToken
      }
    )

    return {
      accessToken: this.createAccessToken(user, refreshToken),
      refreshToken
    }
  }


  private getToken(user: User, tokenType, expires, refreshToken = null): string {
    if (refreshToken) {
      return this.jwtService.sign({
        email: user.email,
        kind: this.getRoleNameUser(user.role),
        sub: user.id,
        refreshToken
      }, {
        secret: tokenType,
        expiresIn: expires
      })
    }

    return this.jwtService.sign({
      email: user.email,
      kind: this.getRoleNameUser(user.role),
      sub: user.id
    }, {
      secret: tokenType,
      expiresIn: expires
    })
  }

  public createRefreshToken(user: User, expires = config.JWT_REFRESH_TOKEN_EXPIRES) {
    return this.getToken(
      user,
      config.JWT_REFRESH_TOKEN,
      expires
    )
  }

  public createAccessToken(user: User, refreshToken, expires = config.JWT_TOKEN_EXPIRES) {
    return this.getToken(
      user,
      config.JWT_SECRET,
      expires,
      refreshToken
    )
  }

  public createResetPasswordToken(user: User, refreshToken, expires = config.JWT_RESET_PASSWORD_TOKEN) {
    return this.getToken(
      user,
      config.JWT_SECRET,
      expires,
      refreshToken
    )
  }

  private getTokenFromHeader(token: string): string {
    return token.replace('Bearer ', '')
  }

  private createPayload(payload: { email: string, kind: string, sub: number, refreshToken: string }): string {
    return this.jwtService.sign(payload)
  }

  public getRoleNameUser(roleUser: number): string {
    switch (roleUser) {
      case ROLE.ADMIN:
        return ROLE_NAME.ADMIN
      case ROLE.SALE:
        return ROLE_NAME.SALE
      case ROLE.SALE_ASSISTANT:
        return ROLE_NAME.SALE_ASSISTANT
      default:
        return ''
    }
  }

  async forgotPassword(body: ForgotPasswordDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {email : body.email},
        relations: {profile: true}
      })

      if(!user) {
        throw new NotFoundException("Don't have this user")
      }

      const resetPasswordToken = this.createResetPasswordToken(user, user.refresh_token)
      console.log(123123);

      await this.mailerService.forgotPasswordMailler(
        user.email,
        `${user.profile.first_name} ${user.profile.last_name}`,
        moment().format('YYYY/MM/DD, hh:mm:ss'),
        resetPasswordToken
      )

      user.reset_password_token = resetPasswordToken;

      await this.userRepository.save(user)

      return {
        message: "We have emailed new information to your email, please check your email",
      }
    } catch (e) {
      checkMysqlError(e)
    }
  }

  private generatePassword() {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  async checkResetToken(
    pagination: PaginationQueryToken,
  ) {
    try {
      const token = pagination.token
      const decodeToken:any = this.jwtService.decode(token)
      const now = Date.now().valueOf() / 1000;

      if(decodeToken == null || decodeToken == "string")  {
        throw new NotFoundException("Don't have this user")
      }

      const user = await this.userRepository.findOne({
        where : {reset_password_token : token}
      })

      if(!user) {
        throw new NotFoundException("OTP link expired, forgot Password again !")
      }

      if(decodeToken?.exp < now ) {
        throw new BadRequestException("OTP link expired")
      }

    return {
      data: user,
    }
    } catch(e) {
      checkMysqlError(e)
    }
  }

  async changePassword(
    body : ChangePasswordWithTokenDto,
  ) {
    try {
      const {password, reset_token } = body
      const decodeToken:any = this.jwtService.decode(reset_token)
      if(decodeToken == null || decodeToken == "string")  {
        throw new NotFoundException("Don't have this user")
      }

      const now = Date.now().valueOf() / 1000;

      const user = await this.userRepository.findOne({
        where : {reset_password_token : reset_token}
      })

      if(!user) {
        throw new NotFoundException("Don't have this user")
      }

      if(decodeToken?.exp < now ) {
        throw new BadRequestException("Time out")
      }

      const hashPassword: string = await bcrypt.hash(password, 12);

      user.password = hashPassword;
      user.reset_password_token = "";
      await this.userRepository.save(user);

      return {
        message : "Update Password Success"
      }

    } catch (e) {
      checkMysqlError(e)
    }
  }
}
