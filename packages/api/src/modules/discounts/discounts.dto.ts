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
  @Min(0)
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
  @Min(0)
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
