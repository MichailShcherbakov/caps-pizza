import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from "class-validator";
import { DiscountСondition } from "~/db/entities/discount-strategy.entity";
import { DiscountTypeEnum } from "~/db/entities/discount.entity";

export class DiscountStrategyDto {
  @Type(() => DiscountСondition)
  @ValidateNested()
  condition: DiscountСondition;

  @IsArray()
  @IsUUID("all", { each: true })
  @IsNotEmpty()
  products_uuids: string[];

  @IsArray()
  @IsUUID("all", { each: true })
  @IsNotEmpty()
  product_categories_uuids: string[];

  @IsArray()
  @IsUUID("all", { each: true })
  @IsNotEmpty()
  modifiers_uuids: string[];
}

export class CreateDiscountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(DiscountTypeEnum)
  @IsNotEmpty()
  type: DiscountTypeEnum;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  value: number;

  @IsArray()
  @Type(() => DiscountStrategyDto)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  strategies: DiscountStrategyDto[];
}

export class UpdateDiscountDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsEnum(DiscountTypeEnum)
  @IsNotEmpty()
  @IsOptional()
  type?: DiscountTypeEnum;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  value?: number;

  @IsArray()
  @Type(() => DiscountStrategyDto)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @IsOptional()
  strategies?: DiscountStrategyDto[];
}
