import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma, RoleName } from 'generated/prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

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
    });
  }

  async findAll(role?: RoleName) {
    if (role) {
      return this.databaseService.user.findMany({
        where: {
          role: {
            name: role,
          },
          deleted: false,
        },
        omit: {
          password: true,
        },
      });
    }

    return this.databaseService.user.findMany();
  }

  findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: { id, deleted: false },
      omit: {
        password: true,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.databaseService.user.update({
      data: updateUserDto,
      where: { id, deleted: false },
    });
  }

  remove(id: number) {
    return this.databaseService.user.update({
      data: {
        deleted: true,
      },
      where: { id },
    });
  }
}
