import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from './ormconfig';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './components/admin/admin.module';
import { UsersModule } from './components/users/users.module';
import { ContactModule } from './components/contacts/contacts.module';
import { AuthModule } from './components/auth/auth.module';
import { ProfilesModule } from './components/profiles/profiles.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';
import * as path from 'path';
import { TagsModule } from './components/tags/tags.module';
import { CustomersModule } from './components/customers/customers.module';
import { CategoriesModule } from './components/categories/categories.module';
import { DealsModule } from './components/deals/deals.module';
import { CidModule } from './components/cid/cid.module';
import { CountriesModule } from './components/countries/countries.module';
import { CurrenciesModule } from './components/currencies/currencies.module';
import { StatusModule } from './components/status/status.module';
import { IndustriesModule } from './components/industries/industries.module';
import { EmployeeModule } from './components/employees/employee.module';
import { CitiesModule } from './components/cities/cities.module';
import { OrderModule } from './components/order/order.module';
import { OrderStatusModule } from './components/order-status/order-status.module';
import { OrderItemModule } from './components/order-item/order-item.module';
import { BillingTypesModule } from './components/billing-types/billing-types.module';
import { InvoiceCategoriesModule } from './components/invoice-categories/invoice-categories.module';
import { InvoicesModule } from './components/invoices/invoices.module';
import { InvoiceOrderItemsModule } from './components/invoice-order-items/invoice-order-items.module';
import { InvoiceAttachmentsModule } from './components/invoice-attachments/invoice-attachments.module';
import { PaymentsModule } from './components/payments/payments.module';
import { PaymentMethodsModule } from './components/payment-methods/payment-methods.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImgStoreModule } from './components/img-store/img-store.module';
import { TasksModule } from './components/tasks/tasks.module';
import { ChecklistModule } from './components/checklist/checklist.module';
import { ChecklistItemModule } from './components/checklist-item/checklist-item.module';
import { LogNotesModule } from './components/log-notes/log-notes.module';
import { CustomerLevelModule } from './components/customer-level/customer-level.module';
import { NotificationsModule } from './components/notifications/notifications.module';
import { SaleChannelModule } from './components/sale-channel/sale-channel.module';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { SystemModule } from './components/system/system.module';
import { PartnerModule } from './components/partner/partner.module';
import { PartnerCustomerModule } from './components/partner-customer/partner-customer.module';
import { LangMiddleware } from './common/middlewares/langMiddleware.middleware';
import { PartnerInvoicesModule } from './components/partner-invoices/partner-invoices.module';
import { LogMiddleware } from './common/middlewares/logMiddleware.middleware';
import { PaymentPartnerModule } from './components/payment-partner/payment-partner.module';
import { MailerModule, HandlebarsAdapter } from '@nest-modules/mailer';
import config from './config';
import { StripeService } from './components/stripe/stripe.service';
import { StripeController } from './components/stripe/stripe.controller';

@Module({
  imports: [
    AdminModule,
    AuthModule,
    TypeOrmModule.forRoot(ormconfig),
    ScheduleModule.forRoot(),
    UsersModule,
    ContactModule,
    ProfilesModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        en: 'en',
        ja: 'ja',
        vi: 'vi',
        pt: 'pt-BR',
      },
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MulterModule.register({
      dest: './files/upload',
    }),
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: config.MAIL_HOST,
          secure: false,
          auth: {
            user: config.MAIL_USERNAME,
            pass: config.MAIL_PASSWORD,
          },
        },
        defaults: {
          from: config.MAIL_FROM,
        },
        template: {
          dir: join(__dirname, 'components/mail/templates/'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    TagsModule,
    CustomersModule,
    CategoriesModule,
    DealsModule,
    TagsModule,
    CidModule,
    CountriesModule,
    CurrenciesModule,
    StatusModule,
    SaleChannelModule,
    IndustriesModule,
    EmployeeModule,
    CitiesModule,
    OrderModule,
    OrderStatusModule,
    OrderItemModule,
    BillingTypesModule,
    InvoiceCategoriesModule,
    InvoicesModule,
    InvoiceOrderItemsModule,
    InvoiceAttachmentsModule,
    PaymentsModule,
    PaymentMethodsModule,
    ImgStoreModule,
    TasksModule,
    ChecklistModule,
    ChecklistItemModule,
    LogNotesModule,
    CustomerLevelModule,
    NotificationsModule,
    SystemModule,
    PartnerModule,
    PartnerCustomerModule,
    PartnerInvoicesModule,
    PaymentPartnerModule,
  ],
  providers: [StripeService],
  controllers: [StripeController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LangMiddleware(), LogMiddleware()).forRoutes('*');
  }
}
