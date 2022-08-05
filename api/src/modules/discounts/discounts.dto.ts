import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
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

  @IsArray()
  @IsNotEmpty()
  products_uuids: string[];

  @IsArray()
  @IsNotEmpty()
  product_categories_uuids: string[];
}

export class UpdateDiscountDto {
  @IsEnum(DiscountTypeEnum)
  @IsNotEmpty()
  @IsOptional()
  type?: DiscountTypeEnum;

  @IsEnum(DiscountScopeEnum)
  @IsNotEmpty()
  @IsOptional()
  scope?: DiscountScopeEnum;

  @IsNotEmptyObject({ nullable: false })
  @IsOptional()
  condition?: DiscountСondition;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsOptional()
  value?: number;

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  products_uuids?: string[];

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  product_categories_uuids?: string[];
}
