import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { IncomeModule } from './income/income.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RolesModule } from './roles/roles.module';
import { TransfersModule } from './transfers/transfers.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [UsersModule, ExpensesModule, IncomeModule, NotificationsModule, RolesModule, TransfersModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
