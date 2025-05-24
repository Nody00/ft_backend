import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RoleName } from 'generated/prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { ROLE_ENUM } from 'src/roles/role.enum';
import { RoleGuard } from 'src/roles/role.guard';

@UseGuards(...[AuthGuard, RoleGuard])
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create-customer')
  @Roles(ROLE_ENUM.ADMIN)
  createCustomer(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.createCustomer(createUserDto);
  }

  @Post('/create-admin')
  @Roles(ROLE_ENUM.ADMIN)
  createAdmin(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.createAdmin(createUserDto);
  }

  @Get()
  @Roles(ROLE_ENUM.ADMIN)
  findAll(@Query('role') role?: RoleName) {
    return this.usersService.findAll(role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
