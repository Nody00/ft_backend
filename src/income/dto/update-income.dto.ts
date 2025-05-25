import { isNotEmpty, Max, Min } from 'class-validator';

export class UpdateIncomeDto {
  @Min(0)
  @Max(999999)
  amount: number;
}
