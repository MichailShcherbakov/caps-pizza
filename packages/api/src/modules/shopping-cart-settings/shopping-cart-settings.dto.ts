import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class SetShoppingCartSettings {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  minimum_order_amount: number;
}
