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
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/permissions/permissions.guard';
import { Permissions } from 'src/permissions/permissions.decorator';

@UseGuards(...[AuthGuard, PermissionsGuard])
@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  @Permissions('INCOME', 'CREATE')
  create(@Body(ValidationPipe) createIncomeDto: CreateIncomeDto) {
    return this.incomeService.create(createIncomeDto);
  }

  @Get()
  @Permissions('INCOME', 'READ')
  findAll(
    @Query('incomeType') incomeType?: string,
    @Query('maxValue') maxValue?: number,
    @Query('minValue') minValue?: number,
    @Query('createdAt') createdAt?: string,
    @Query('thisWeek') thisWeek?: boolean,
    @Query('thisMonth') thisMonth?: boolean,
    @Query('thisYear') thisYear?: boolean,
    @Query('dateGTE') dateGTE?: string,
    @Query('dateLTE') dateLTE?: string,
    @Query('user_id') user_id?: number,
    @Query('sort_by') sort_by?: string,
    @Query('sort_order') sort_order?: 'asc' | 'desc',
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
  ) {
    return this.incomeService.findAll({
      incomeType,
      maxValue,
      minValue,
      createdAt,
      thisWeek,
      thisMonth,
      thisYear,
      dateGTE,
      dateLTE,
      user_id,
      sort_by,
      sort_order,
      skip,
      limit,
    });
  }

  @Get(':id')
  @Permissions('INCOME', 'READ')
  findOne(@Param('id') id: string) {
    return this.incomeService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('INCOME', 'UPDATE')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateIncomeDto: UpdateIncomeDto,
  ) {
    return this.incomeService.update(+id, updateIncomeDto);
  }

  @Delete(':id')
  @Permissions('INCOME', 'DELETE')
  remove(@Param('id') id: string) {
    return this.incomeService.remove(+id);
  }
}
