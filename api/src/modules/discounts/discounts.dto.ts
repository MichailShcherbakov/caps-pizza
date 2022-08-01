import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";
import {
  DiscountScopeEnum,
  DiscountTypeEnum,
  DiscountСondition,
} from "~/db/entities/discount.entity";

export class CreateDiscountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(DiscountTypeEnum)
  @IsNotEmpty()
  type: DiscountTypeEnum;

  @IsEnum(DiscountScopeEnum)
  @IsNotEmpty()
  scope: DiscountScopeEnum;

  @IsNotEmptyObject({ nullable: false })
  condition: DiscountСondition;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  value: number;
}
