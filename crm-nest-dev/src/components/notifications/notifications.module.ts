import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notification, LogNote, User } from 'src/entities';
// import { NotificationGateWay } from './notifications.gateway';
import { LogNotesService } from '../log-notes/log-notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, LogNote, User])],
  controllers: [NotificationsController],
  providers: [NotificationsService, LogNotesService]
})
export class NotificationsModule {}
