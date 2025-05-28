import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

import { Namespace, Server, Socket } from 'socket.io';
import { NotificationTypes } from 'generated/prisma';

@WebSocketGateway({
  namespace: 'notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly notificationsService: NotificationsService) {}
  @WebSocketServer() server: Namespace;

  afterInit(server: any) {
    console.log('Websocket gateway initilized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected ${client.id}`);
  }

  async create(createNotificationDto: CreateNotificationDto) {
    // create notification in db
    await this.notificationsService.create({
      ...createNotificationDto,
      data: undefined,
    });

    // send alert to client to show the notification in app
    this.server.emit(createNotificationDto.type, createNotificationDto);

    // send email to user
  }

  findAll() {
    return this.notificationsService.findAll();
  }

  findOne(@MessageBody() id: number) {
    return this.notificationsService.findOne(id);
  }

  update(@MessageBody() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(
      updateNotificationDto.id,
      updateNotificationDto,
    );
  }

  remove(@MessageBody() id: number) {
    return this.notificationsService.remove(id);
  }
}
