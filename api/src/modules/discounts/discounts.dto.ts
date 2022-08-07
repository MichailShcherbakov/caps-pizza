import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
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

  @ValidateNested()
  condition: DiscountСondition;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  value: number;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  products_uuids: string[];

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  product_categories_uuids: string[];

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  modifiers_uuids: string[];
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

  @IsEnum(DiscountScopeEnum)
  @IsNotEmpty()
  @IsOptional()
  scope?: DiscountScopeEnum;

  @ValidateNested()
  @IsOptional()
  condition?: DiscountСondition;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsOptional()
  value?: number;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  @IsOptional()
  products_uuids?: string[];

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  @IsOptional()
  product_categories_uuids?: string[];

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  @IsOptional()
  modifiers_uuids?: string[];
}
