import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [TransfersController],
  providers: [TransfersService],
  imports: [DatabaseModule],
})
export class TransfersModule {}
