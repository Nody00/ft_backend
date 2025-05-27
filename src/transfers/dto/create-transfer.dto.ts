import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTransferDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @IsNotEmpty()
  sender_id: number;

  @IsNotEmpty()
  recipient_id: number;

  @IsNotEmpty()
  amount: number;
}
