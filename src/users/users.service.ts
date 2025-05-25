import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma, RoleName } from 'generated/prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { UpdateNotificationDto } from 'src/notifications/dto/update-notification.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createCustomer(createUserDto: CreateUserDto) {
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

    return this.databaseService.user.create({
      data: customerObject,
    });
  }

  async createAdmin(createUserDto: CreateUserDto) {
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

    return this.databaseService.user.create({
      data: adminObject,
      omit: {
        password: true,
      },
    });
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
