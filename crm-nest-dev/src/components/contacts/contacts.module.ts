import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from 'src/entities/contact.entity';
import { ContactController } from './contacts.controller';
import { ContactService } from './contacts.service';
import { PaginationMiddleware } from '../../common/middlewares';
import { Customer } from '../../entities/customer.entity';
import { Tag } from '../../entities/tag.entity';
import { LogNote } from 'src/entities/log-note.entity';
import { Currency, User } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, Customer, Tag, LogNote, Currency, User])],
  controllers: [ContactController],
  providers: [ContactService]
})
export class ContactModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaginationMiddleware())
      .forRoutes(
        { path: 'contacts', method: RequestMethod.GET },
      );
  }
}
