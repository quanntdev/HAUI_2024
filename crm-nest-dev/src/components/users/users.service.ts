import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DEFAULT_LIMIT_PAGINATE,
  ERROR_CODES,
  ROLE_NAME,
  UPLOAD_PROFILE_IMAGE_FORDER,
} from 'src/constants';
import {
  Profile,
  selectedKeysProfile,
  selectedKeysUser,
  User,
} from '../../entities';
import { Brackets, IsNull, Repository } from 'typeorm';
import { MysqlError } from 'mysql';
import { CreateNewUser } from './dtos/users.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUsers } from './dtos/update-users.dto';
import { AuthService } from '../auth/auth.service';
import config from '../../config';
import { ProfilesService } from '../profiles/profiles.service';
import { UpdateMyProfileDto } from './dtos/update-my-profile.dto.user';
import { RequestWithUser } from 'src/common/interfaces';
import { join } from 'path';
import { UpdateMyPassword } from './dtos/update-my-password.dto';
import { UpdateLanguages } from './dtos/update-languagues.dto';
import { JwtService } from '@nestjs/jwt';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';
const fs = require('fs').promises;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private profileService: ProfilesService,
    private authService: AuthService,
    private jwtService: JwtService,

    private i18n: I18nService<I18nTranslations>,
  ) {}

  public getListUser(pagination: any, authId: number) {
    try {
      const { offset, limit = DEFAULT_LIMIT_PAGINATE, keyword } = pagination;
      const query = this.usersRepository
        .createQueryBuilder('users')
        // .where('users.id != :id', {id: authId})
        .orderBy('users.id', 'DESC')
        .leftJoinAndSelect('users.profile', 'profiles')
        .select([
          ...selectedKeysUser.map((x) => `users.${x}`),
          ...selectedKeysProfile.map((x) => `profiles.${x}`),
        ])
        .skip(offset)
        .take(limit);

      if (keyword) {
        query.andWhere(
          new Brackets((qr) => {
            qr.where('users.email LIKE :keyword', { keyword: `%${keyword}%` })
              .orWhere('profiles.first_name LIKE :keyword', {
                keyword: `%${keyword}%`,
              })
              .orWhere('profiles.last_name LIKE :keyword', {
                keyword: `%${keyword}%`,
              });
          }),
        );
      }

      return query.getManyAndCount();
    } catch (error) {
      this.checkMysqlError(error);
    }
  }

  public async getMyProfile(id: number, Headers: any) {
    try {
      const lang = Headers.lang;
      const user: any = await this.usersRepository.findOne({
        where: { id },
        relations: {
          profile: true,
        },
      });
      if (!user) {
        throw new Error(
          this.i18n.t('message.status_messages.not_found_user', {
            lang: lang,
          }),
        );
      }
      return {
        data: user,
      };
    } catch (error) {
      this.checkMysqlError(error);
    }
  }

  public async delete(id: number, authId: number, Headers: any) {
    const lang = Headers.lang;
    const users = await this.usersRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['profile'],
    });

    if (id === authId) {
      throw new Error(
        this.i18n.t('message.status_messages.unauthorized', {
          lang: lang,
        }),
      );
    }
    if (!users) {
      this.i18n.t('message.status_messages.not_found_user', {
        lang: lang,
      });
    }

    try {
      if (users.profile) {
        await this.profileService.remove(users.profile.id);
      }
      await this.usersRepository.softDelete(id);
      return {
        message: this.i18n.t('message.status_messages.delete_success', {
          lang: lang,
        }),
        id: users.id,
      };
    } catch (error) {
      this.checkMysqlError(error);
    }
  }

  private checkMysqlError(error: any) {
    const mysqlError = error as MysqlError;
    if (mysqlError.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(mysqlError.sqlMessage);
    else throw new InternalServerErrorException(mysqlError.message);
  }

  public async uploadUserLangues(req, body: UpdateLanguages, headers) {
    try {
      const userId = +req.user.userId;
      const data = await this.usersRepository.update(userId, {
        language: body.languages,
      });

      return {
        data: data,
      };
    } catch (e) {
      this.checkMysqlError(e);
    }
  }

  public async updateUserProfile(
    req: RequestWithUser,
    body: UpdateMyProfileDto,
    file: string,
    Headers: any,
  ) {
    const lang = Headers.lang;
    const { email, ...profileinfo } = body;
    let newProfile = {
      ...profileinfo,
    };
    if (
      profileinfo.birth_of_date === '' ||
      profileinfo.birth_of_date === 'null'
    ) {
      newProfile = {
        ...profileinfo,
        birth_of_date: null,
      };
    }
    try {
      const isLoggedInUserId = Number(req.user.userId);
      const isLoggedInUser = await this.usersRepository.findOne({
        where: { id: isLoggedInUserId },
        relations: { profile: true },
      });
      let isLoggedInUserProfile: any = null;
      if (!isLoggedInUser) {
        throw new NotFoundException(
          this.i18n.t('message.status_messages.not_found_user', {
            lang: lang,
          }),
        );
      }

      if (isLoggedInUser && !!isLoggedInUser.profile) {
        isLoggedInUserProfile = isLoggedInUser.profile;
      } else {
        isLoggedInUserProfile = await this.profileRepository.save({
          ...newProfile,
          user: isLoggedInUser,
        });
      }
      if (email != isLoggedInUser.email) {
        await this.usersRepository.update(isLoggedInUserId, {
          email,
        });
      }
      if (file) {
        if (isLoggedInUserProfile.profileImg !== "") {
          await this.deleteImage(isLoggedInUserProfile.profileImg);
        }
        newProfile = {
          ...newProfile,
          profileImg: file,
        };
        await this.profileRepository.update(isLoggedInUserProfile?.id, {
          ...isLoggedInUserProfile,
          ...newProfile,
        });
      } else {
        await this.profileRepository.update(isLoggedInUserProfile?.id, {
          ...isLoggedInUserProfile,
          ...newProfile,
        });
      }

      const updatedUser = await this.usersRepository.findOne({
        where: { id: isLoggedInUserId },
        relations: { profile: true },
      });
      return {
        data: updatedUser,
        message: this.i18n.t('message.status_messages.update_success', {
          lang: lang,
        }),
      };
    } catch (error) {
      if (file) {
        await this.deleteImage(file);
      }
      this.checkMysqlError(error);
    }
  }

  public async updateMyPassword(
    req: RequestWithUser,
    body: UpdateMyPassword,
    Headers: any,
  ) {
    const lang = Headers.lang;
    const { oldPassword, password, confirm_password } = body;
    const isLoggedInUserId = Number(req.user.userId);
    try {
      if (password !== confirm_password) {
        throw new BadRequestException('CONFIRM PASSWORD IS NOT CORRECT ');
      }
      const isLoggedInUser = await this.usersRepository.findOne({
        where: { id: isLoggedInUserId },
      });
      if (!(await bcrypt.compare(oldPassword, isLoggedInUser.password))) {
        throw new BadRequestException(
          this.i18n.t('message.status_messages.password_invalid', {
            lang: lang,
          }),
        );
      }
      const passwordHash: string = await bcrypt.hash(
        password,
        +config.BCRYPT_SALT_ROUND,
      );
      await this.usersRepository.update(isLoggedInUserId, {
        ...isLoggedInUser,
        password: passwordHash,
      });
      return {
        data: [],
        message: this.i18n.t('message.status_messages.update_success', {
          lang: lang,
        }),
      };
    } catch (error) {
      this.checkMysqlError(error);
    }
  }

  public async create(body: CreateNewUser, Headers: any) {
    try {
      const lang = Headers.lang;
      const hashPassword: string = await bcrypt.hash(body.password, 12);
      body = { ...body, password: hashPassword };
      const userInfo: { email: string; password: string; role: any } = body;
      const userCreate: User = await this.usersRepository.save({
        ...userInfo,
      });
      const profileInfo = { ...body, user: userCreate.id };
      const {
        first_name,
        last_name,
        phone,
        birth_of_date,
        date_of_joining,
        address,
        gender,
        user,
      } = profileInfo;

      const profile: Profile = await this.profileService.create({
        first_name,
        last_name,
        phone,
        birth_of_date,
        date_of_joining,
        address,
        gender,
        user,
      });

      // Create refresh token
      await this.usersRepository.update(+userCreate.id, {
        refresh_token: this.authService.createRefreshToken(userCreate),
      });

      return {
        message: this.i18n.t('message.status_messages.create_success', {
          lang: lang,
        }),
        data: userCreate,
      };
    } catch (error) {
      this.checkMysqlError(error);
    }
  }

  public async update(
    id: number,
    body: UpdateUsers,
    authUser: { userId: string; email: string; kind: string },
    Headers: any,
  ) {
    try {
      const lang = Headers.lang;
      if (
        authUser.kind === ROLE_NAME.ADMIN ||
        parseInt(authUser.userId) === id
      ) {
        let { email, role, password, confirm_password, ...restBody } = body;
        let userUpdate = { email, role, password };
        const user: any = await this.usersRepository.findOne({
          where: { id },
          relations: {
            profile: true,
          },
        });
        if (!user) {
          throw new NotFoundException(
            this.i18n.t('message.status_messages.not_found_user', {
              lang: lang,
            }),
          );
        }
        if (password) {
          const passwordHash: string = !!body.password.length
            ? await bcrypt.hash(password, +config.BCRYPT_SALT_ROUND)
            : user.password;
          userUpdate = { ...userUpdate, password: passwordHash };
        }
        delete restBody.lang
        if (user.profile != null) {
          await this.profileRepository.update(user.profile.id, restBody);
        } else {
          await this.profileRepository.save({
            ...restBody,
            user: user,
          });
        }
        await this.usersRepository.update(id, userUpdate);
        return {
          message: this.i18n.t('message.status_messages.update_success', {
            lang: lang,
          }),
          data: userUpdate,
        };
      }
      return { message: ERROR_CODES.UNAUTHORIZED };
    } catch (error) {
      this.checkMysqlError(error);
    }
  }

  private async deleteImage(file: string) {
    try {
      if(fs.existsSync( join(process.cwd() + `/${UPLOAD_PROFILE_IMAGE_FORDER}/` + file))) {
      return await fs?.unlink(
        join(process.cwd() + `/${UPLOAD_PROFILE_IMAGE_FORDER}/` + file),
      );
    }
    } catch {
      return true
    }
  }

  private createPayload(payload: {
    email: string;
    kind: string;
    sub: number;
    refreshToken: string;
    lang: string;
  }): string {
    return this.jwtService.sign(payload);
  }
}
