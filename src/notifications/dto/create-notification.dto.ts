import { NotificationTypes } from 'generated/prisma';

export class CreateNotificationDto {
  description: string;
  type: NotificationTypes;
  user_id: number;
  data?: any;
}
