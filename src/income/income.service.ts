import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { DatabaseService } from 'src/database/database.service';
import {
  getMonthDateRange,
  getWeekDateRange,
  getYearDateRange,
} from './helpers';

interface FindAllFilters {
  incomeType?: string;
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
export class IncomeService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createIncomeDto: CreateIncomeDto) {
    const foundUser = this.databaseService.user.findUnique({
      where: { id: createIncomeDto.user_id, deleted: false },
    });

    if (!foundUser) {
      throw new HttpException('No such user found!', HttpStatus.BAD_REQUEST);
    }

    return this.databaseService.income.create({
      data: createIncomeDto,
    });
  }

  findAll(filters: FindAllFilters) {
    let whereQuery = {};
    let orderBy = {};

    if (filters.incomeType) {
      whereQuery['incomeType'] = {
        name: filters.incomeType,
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

    return this.databaseService.income.findMany({
      where: { ...whereQuery, deleted: false },
      skip: filters.skip ? +filters.skip : 0,
      take: filters.limit ? +filters.limit : 10,
      orderBy: { ...orderBy },
    });
  }

  findOne(id: number) {
    return this.databaseService.income.findUnique({
      where: { id, deleted: false },
    });
  }

  update(id: number, updateIncomeDto: UpdateIncomeDto) {
    return this.databaseService.income.update({
      where: { id },
      data: updateIncomeDto,
    });
  }

  remove(id: number) {
    return this.databaseService.income.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
