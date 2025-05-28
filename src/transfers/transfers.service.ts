import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { DatabaseService } from 'src/database/database.service';
import {
  getMonthDateRange,
  getWeekDateRange,
  getYearDateRange,
} from 'src/income/helpers';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';

interface FindAllFilters {
  description?: string;
  sender_id?: number;
  recipient_id?: number;
  amount?: number;
  amountMax?: number;
  amountMin?: number;
  createdAt?: string;
  thisWeek?: boolean;
  thisMonth?: boolean;
  thisYear?: boolean;
  dateGTE?: string;
  dateLTE?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  skip?: number;
  limit?: number;
}

@Injectable()
export class TransfersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(createTransferDto: CreateTransferDto) {
    try {
      // check sender and recipient ids
      const foundSender = await this.databaseService.user.findUnique({
        where: { id: +createTransferDto.sender_id, deleted: false },
      });

      const foundRecipient = await this.databaseService.user.findUnique({
        where: {
          id: +createTransferDto.recipient_id,
          deleted: false,
        },
      });

      if (!foundSender) {
        throw new HttpException('No such sender user', HttpStatus.BAD_REQUEST);
      }

      if (!foundRecipient) {
        throw new HttpException(
          'No such recipient user',
          HttpStatus.BAD_REQUEST,
        );
      }

      const createdTransfer = await this.databaseService.transfer.create({
        data: createTransferDto,
      });

      const payload: CreateNotificationDto = {
        type: 'NEW_TRANSFER',
        user_id: createdTransfer.sender_id,
        description: `New transaction: ${createdTransfer.description}`,
        data: createdTransfer,
      };

      await this.notificationsGateway.create(payload);

      return createdTransfer;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  findAll(filters: FindAllFilters) {
    let whereQuery = {};
    let orderBy = {};

    if (filters.amountMax && !filters.amountMin) {
      whereQuery['amount'] = {
        lte: +filters.amountMax,
      };
    }

    if (filters.amountMin && !filters.amountMax) {
      whereQuery['amount'] = {
        gte: +filters.amountMin,
      };
    }

    if (filters.amountMin && filters.amountMax) {
      whereQuery['amount'] = {
        gte: +filters.amountMin,
        lte: +filters.amountMax,
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

    if (filters.sender_id) {
      whereQuery['sender_id'] = +filters.sender_id;
    }

    if (filters.recipient_id) {
      whereQuery['recipient_id'] = +filters.recipient_id;
    }

    if (filters.sort_by) {
      orderBy[filters.sort_by] = filters.sort_order || 'desc';
    }

    if (filters.description) {
      whereQuery['description'] = {
        contains: filters.description,
        mode: 'insensitive',
      };
    }

    return this.databaseService.transfer.findMany({
      where: { ...whereQuery, deleted: false },
      skip: filters.skip ? +filters.skip : 0,
      take: filters.limit ? +filters.limit : 10,
      orderBy: { ...orderBy },
    });
  }

  findOne(id: number) {
    return this.databaseService.transfer.findUnique({
      where: {
        id: +id,
        deleted: false,
      },
    });
  }

  update(id: number, updateTransferDto: UpdateTransferDto) {
    return `This action updates a #${id} transfer`;
  }

  remove(id: number) {
    return this.databaseService.transfer.update({
      where: { id: +id },
      data: {
        deleted: true,
      },
    });
  }
}
