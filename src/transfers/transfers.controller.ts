import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/permissions/permissions.guard';
import { Permissions } from 'src/permissions/permissions.decorator';

@UseGuards(...[AuthGuard, PermissionsGuard])
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  @Permissions('TRANSFER', 'CREATE')
  create(@Body(ValidationPipe) createTransferDto: CreateTransferDto) {
    return this.transfersService.create(createTransferDto);
  }

  @Get()
  @Permissions('TRANSFER', 'READ')
  findAll(
    @Query('description') description?: string,
    @Query('sender_id') sender_id?: number,
    @Query('recipient_id') recipient_id?: number,
    @Query('amount') amount?: number,
    @Query('amountMax') amountMax?: number,
    @Query('amountMin') amountMin?: number,
    @Query('createdAt') createdAt?: string,
    @Query('thisWeek') thisWeek?,
    @Query('thisMonth') thisMonth?: boolean,
    @Query('thisYear') thisYear?: boolean,
    @Query('dateGTE') dateGTE?: string,
    @Query('dateLTE') dateLTE?: string,
    @Query('sort_by') sort_by?: string,
    @Query('sort_order') sort_order?: 'asc' | 'desc',
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
  ) {
    return this.transfersService.findAll({
      description,
      sender_id,
      recipient_id,
      amount,
      amountMax,
      amountMin,
      createdAt,
      thisWeek,
      thisMonth,
      thisYear,
      dateGTE,
      dateLTE,
      sort_by,
      sort_order,
      skip,
      limit,
    });
  }

  @Get(':id')
  @Permissions('TRANSFER', 'READ')
  findOne(@Param('id') id: string) {
    return this.transfersService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('TRANSFER', 'UPDATE')
  update(
    @Param('id') id: string,
    @Body() updateTransferDto: UpdateTransferDto,
  ) {
    return this.transfersService.update(+id, updateTransferDto);
  }

  @Delete(':id')
  @Permissions('TRANSFER', 'DELETE')
  remove(@Param('id') id: string) {
    return this.transfersService.remove(+id);
  }
}
