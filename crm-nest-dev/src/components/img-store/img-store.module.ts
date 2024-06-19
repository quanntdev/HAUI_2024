import { Module } from '@nestjs/common';
import { ImgStoreService } from './img-store.service';
import { ImgStoreController } from './img-store.controller';
import { CronImgService } from './cron-img-store.service';
import { Contact, Profile, User } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Contact, User])],
  controllers: [ImgStoreController],
  providers: [ImgStoreService, CronImgService, JwtService],
})
export class ImgStoreModule {}
