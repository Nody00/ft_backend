import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [NotificationsGateway, NotificationsService],
  imports: [DatabaseModule],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
