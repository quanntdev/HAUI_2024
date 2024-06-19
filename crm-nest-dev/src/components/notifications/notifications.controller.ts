import { Controller, Get, UseGuards, Request, Put, Param, Req, Headers} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserSignedGuard } from 'src/common/guards/user';
import { RequestWithUser } from 'src/common/interfaces';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('api/notifications')
@ApiBearerAuth()
@UseGuards(UserSignedGuard)
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get()
  findAll(
    @Request() req: RequestWithUser,
    @Headers() headers,
  ) {
    return this.notificationService.findAll(req, headers);
  }

  @Put("/update-seen/:id")
  updateSeen(
    @Param('id') id: string,
    @Req() req: RequestWithUser
  ) {
    return this.notificationService.updateSeen(+id, req)
  }

  @Put("/update-seen-all")
  updateSeenAll(
    @Req() req: RequestWithUser
  ) {
    return this.notificationService.updateSeenAll(req)
  }
}
