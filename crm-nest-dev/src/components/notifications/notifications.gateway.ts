import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { notificationSocketAction } from './enum/notifications.enum';


// @WebSocketGateway({ cors: '*' })
// export class NotificationGateWay
// {

//   @WebSocketServer() server: Server;

//   @SubscribeMessage('notifications')
//   async findAll(@MessageBody() data: any) {
//     return { event: 'notifications', data: notificationSocketAction.CREATED }
//   }
// }
