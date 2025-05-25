import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RoleName } from 'generated/prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/permissions/permissions.guard';
import { Permissions } from 'src/permissions/permissions.decorator';

@UseGuards(...[AuthGuard, PermissionsGuard])
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create-customer')
  @Permissions('USER', 'CREATE')
  createCustomer(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.createCustomer(createUserDto);
  }

  @Post('/create-admin')
  @Permissions('USER', 'CREATE')
  createAdmin(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.createAdmin(createUserDto);
  }

  @Get()
  @Permissions('USER', 'READ')
  findAll(@Query('role') role?: RoleName) {
    return this.usersService.findAll(role);
  }

  @Get(':id')
  @Permissions('USER', 'READ')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @Patch(':id')
  // @Permissions('USER', 'UPDATE')
  // update(
  //   @Param('id') id: string,
  //   @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  //   @Req() request: Request,
  // ) {
  //   return this.usersService.update(+id, updateUserDto, request);
  // }

  @Delete(':id')
  @Permissions('USER', 'DELETE')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
