import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationMiddleware } from 'src/common/middlewares';
import { Profile, User } from '../../entities';
import { AdminService } from '../admin/admin.service';
import { AuthService } from '../auth/auth.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ProfilesService } from '../profiles/profiles.service';
import { CheckLengthPassword } from 'src/common/validatorContraints/customeValidate/checkLengthPassword';
import { CheckSamePassword } from 'src/common/validatorContraints/customeValidate/checkSamePassword';
import { CheckRole } from 'src/common/validatorContraints/customeValidate/checkRole';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Profile]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    JwtService,
    AdminService,
    ProfilesService,
    CheckLengthPassword,
    CheckSamePassword,
    CheckRole,
    MailService
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaginationMiddleware())
      .forRoutes({ path: 'users', method: RequestMethod.GET });
  }
}
