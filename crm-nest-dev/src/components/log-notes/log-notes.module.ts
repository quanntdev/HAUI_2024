import { Module } from '@nestjs/common';
import { LogNotesService } from './log-notes.service';
import { LogNotesController } from './log-notes.controller';
import { LogNote, User, Notification } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LogNote, User, Notification])],
  controllers: [LogNotesController],
  providers: [LogNotesService],
})
export class LogNotesModule {}
