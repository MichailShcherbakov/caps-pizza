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
import {
  DiscountTypeEnum,
  DiscountСondition,
} from "~/db/entities/discount.entity";

export class DiscountProductDto {
  @IsUUID()
  @IsNotEmpty()
  product_uuid: string;

  @IsArray()
  @IsUUID("all", { each: true })
  @IsNotEmpty()
  modifiers_uuids: string[];
}

export class DiscountProductCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  category_uuid: string;

  @IsArray()
  @IsUUID("all", { each: true })
  @IsNotEmpty()
  modifiers_uuids: string[];
}

export class DiscountModifierDto {
  @IsUUID()
  @IsNotEmpty()
  modifier_uuid: string;
}

export class CreateDiscountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(DiscountTypeEnum)
  @IsNotEmpty()
  type: DiscountTypeEnum;

  @Type(() => DiscountСondition)
  @ValidateNested()
  condition: DiscountСondition;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  value: number;

  @Type(() => DiscountProductDto)
  @ValidateNested({ each: true })
  products: DiscountProductDto[];

  @Type(() => DiscountProductCategoryDto)
  @ValidateNested({ each: true })
  product_categories: DiscountProductCategoryDto[];

  @Type(() => DiscountModifierDto)
  @ValidateNested({ each: true })
  modifiers: DiscountModifierDto[];
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

  @Type(() => DiscountСondition)
  @ValidateNested()
  @IsOptional()
  condition?: DiscountСondition;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  value?: number;

  @Type(() => DiscountProductDto)
  @ValidateNested()
  @IsOptional()
  products?: DiscountProductDto[];

  @Type(() => DiscountProductCategoryDto)
  @ValidateNested()
  @IsOptional()
  product_categories?: DiscountProductCategoryDto[];

  @Type(() => DiscountModifierDto)
  @ValidateNested()
  @IsOptional()
  modifiers?: DiscountModifierDto[];
}
