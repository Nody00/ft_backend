import { IsInt, IsNotEmpty, IsString } from 'class-validator';
export class CreateIncomeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  income_type_id: number;

  @IsNotEmpty()
  amount: number;

  @IsInt()
  @IsNotEmpty()
  user_id: number;
}
