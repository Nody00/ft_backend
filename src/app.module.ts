import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { IncomeModule } from './income/income.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RolesModule } from './roles/roles.module';
import { TransfersModule } from './transfers/transfers.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    UsersModule,
    ExpensesModule,
    IncomeModule,
    NotificationsModule,
    RolesModule,
    TransfersModule,
    DatabaseModule,
    AuthModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
