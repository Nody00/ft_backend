import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma, RoleName } from 'generated/prisma';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createUserDto: Prisma.UserCreateInput) {
    return this.databaseService.user.create({
      data: createUserDto,
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

  update(id: number, updateUserDto: Prisma.UserUpdateInput) {
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
