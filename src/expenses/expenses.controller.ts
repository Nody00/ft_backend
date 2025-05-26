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
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/permissions/permissions.guard';
import { Permissions } from 'src/permissions/permissions.decorator';

@UseGuards(...[AuthGuard, PermissionsGuard])
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Permissions('EXPENSE', 'CREATE')
  create(@Body(ValidationPipe) createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  @Permissions('EXPENSE', 'READ')
  findAll(
    @Query('expenseType') expenseType?: string,
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
    return this.expensesService.findAll({
      expenseType,
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
  @Permissions('EXPENSE', 'READ')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('EXPENSE', 'UPDATE')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(+id, updateExpenseDto);
  }

  @Delete(':id')
  @Permissions('EXPENSE', 'DELETE')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(+id);
  }
}
