import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { DatabaseService } from 'src/database/database.service';
import {
  getMonthDateRange,
  getWeekDateRange,
  getYearDateRange,
} from 'src/income/helpers';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';

interface FindAllFilters {
  expenseType?: string;
  maxValue?: number;
  minValue?: number;
  createdAt?: string;
  thisWeek?: boolean;
  thisMonth?: boolean;
  thisYear?: boolean;
  dateGTE?: string;
  dateLTE?: string;
  user_id?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  skip?: number;
  limit?: number;
}

@Injectable()
export class ExpensesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    try {
      const foundUser = await this.databaseService.user.findUnique({
        where: { id: createExpenseDto.user_id, deleted: false },
      });

      const foundExpenseType =
        await this.databaseService.expenseType.findUnique({
          where: { id: createExpenseDto.expense_type_id, deleted: false },
        });

      if (!foundUser) {
        throw new HttpException('No such user found!', HttpStatus.BAD_REQUEST);
      }

      if (!foundExpenseType) {
        throw new HttpException(
          'No such expense type found',
          HttpStatus.BAD_REQUEST,
        );
      }

      const createdExpense = await this.databaseService.expense.create({
        data: createExpenseDto,
      });

      const notification: CreateNotificationDto = {
        description: `Added new expense ${createdExpense.name}`,
        type: 'NEW_EXPENSE',
        user_id: createdExpense.user_id,
      };

      await this.notificationsGateway.create(notification);

      return createdExpense;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  findAll(filters: FindAllFilters) {
    let whereQuery = {};
    let orderBy = {};

    if (filters.expenseType) {
      whereQuery['expenseType'] = {
        name: filters.expenseType,
      };
    }

    if (filters.maxValue && !filters.minValue) {
      whereQuery['amount'] = {
        lte: +filters.maxValue,
      };
    }

    if (filters.minValue && !filters.maxValue) {
      whereQuery['amount'] = {
        gte: +filters.minValue,
      };
    }

    if (filters.minValue && filters.maxValue) {
      whereQuery['amount'] = {
        gte: +filters.minValue,
        lte: +filters.maxValue,
      };
    }

    if (filters.createdAt) {
      whereQuery['created_at'] = new Date(filters.createdAt);
    }

    if (filters.thisWeek) {
      const { startDate, endDate } = getWeekDateRange();
      whereQuery['created_at'] = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (filters.thisMonth) {
      const { startDate, endDate } = getMonthDateRange();
      whereQuery['created_at'] = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (filters.thisYear) {
      const { startDate, endDate } = getYearDateRange();
      whereQuery['created_at'] = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (filters.dateGTE && !filters.dateLTE) {
      whereQuery['created_at'] = {
        gte: new Date(filters.dateGTE),
      };
    }

    if (!filters.dateGTE && filters.dateLTE) {
      whereQuery['created_at'] = {
        lte: new Date(filters.dateLTE),
      };
    }

    if (filters.dateGTE && filters.dateLTE) {
      whereQuery['created_at'] = {
        gte: new Date(filters.dateGTE),
        lte: new Date(filters.dateLTE),
      };
    }

    if (filters.user_id) {
      whereQuery['user_id'] = +filters.user_id;
    }

    if (filters.sort_by) {
      orderBy[filters.sort_by] = filters.sort_order || 'desc';
    }

    return this.databaseService.expense.findMany({
      where: { ...whereQuery, deleted: false },
      skip: filters.skip ? +filters.skip : 0,
      take: filters.limit ? +filters.limit : 10,
      orderBy: { ...orderBy },
    });
  }

  findOne(id: number) {
    return this.databaseService.expense.findUnique({
      where: { id, deleted: false },
    });
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return this.databaseService.expense.update({
      where: { id },
      data: updateExpenseDto,
    });
  }

  remove(id: number) {
    return this.databaseService.expense.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
