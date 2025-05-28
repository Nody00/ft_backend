import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { NotificationTypes, Prisma, RoleName } from 'generated/prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { UpdateNotificationDto } from 'src/notifications/dto/update-notification.dto';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async createCustomer(createUserDto: CreateUserDto) {
    try {
      const foundCustomer = await this.databaseService.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (foundCustomer) {
        throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
      }

      const foundRole = await this.databaseService.role.findUnique({
        where: { name: RoleName.CUSTOMER },
      });

      if (!foundRole) {
        throw new HttpException('No role found!', HttpStatus.BAD_REQUEST);
      }

      const password = await bcrypt.hash(createUserDto.password, 12);

      const customerObject = {
        ...createUserDto,
        password: password,
        role_id: foundRole.id,
      };

      const createdUser = await this.databaseService.user.create({
        data: customerObject,
      });

      const notification: CreateNotificationDto = {
        type: NotificationTypes.NEW_USER,
        description: `New user created with email: ${createdUser.email}.`,
        user_id: createdUser.id,
      };

      await this.notificationsGateway.create(notification);

      return createdUser;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async createAdmin(createUserDto: CreateUserDto) {
    try {
      const foundAdmin = await this.databaseService.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (foundAdmin) {
        throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
      }

      const foundRole = await this.databaseService.role.findUnique({
        where: { name: RoleName.ADMIN },
      });

      if (!foundRole) {
        throw new HttpException('No role found!', HttpStatus.BAD_REQUEST);
      }

      const password = await bcrypt.hash(createUserDto.password, 12);

      const adminObject = {
        ...createUserDto,
        password: password,
        role_id: foundRole.id,
      };

      const createdUser = await this.databaseService.user.create({
        data: adminObject,
        omit: {
          password: true,
        },
      });

      const notification: CreateNotificationDto = {
        type: NotificationTypes.NEW_USER,
        description: `New user created with email: ${createdUser.email}.`,
        user_id: createdUser.id,
      };

      await this.notificationsGateway.create(notification);

      return createdUser;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async findAll(role?: RoleName) {
    if (role) {
      return this.databaseService.user.findMany({
        omit: {
          password: true,
        },
        include: {
          role: true,
        },
        where: {
          role: {
            name: role,
          },
          deleted: false,
        },
      });
    }

    return this.databaseService.user.findMany({
      omit: {
        password: true,
      },
    });
  }

  findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: { id, deleted: false },
      omit: {
        password: true,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto, request: Request) {
    const user = (request as any).user;

    if (id !== user.id && user.role.name !== 'ADMIN') {
      throw new HttpException(
        'Insufficient permissions!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.databaseService.user.update({
      data: updateUserDto,
      where: { id, deleted: false },
      omit: { password: true },
    });
  }

  remove(id: number) {
    return this.databaseService.user.update({
      data: {
        deleted: true,
      },
      where: { id },
      omit: { password: true },
    });
  }
}
