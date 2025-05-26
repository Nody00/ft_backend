import { IsInt, IsNotEmpty, IsString } from 'class-validator';
export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  expense_type_id: number;

  @IsNotEmpty()
  amount: number;

  @IsInt()
  @IsNotEmpty()
  user_id: number;
}
