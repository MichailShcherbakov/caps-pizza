import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from "class-validator";
import { ProductVolume, ProductWeight } from "~/db/entities/product.entity";

export class CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  article_number: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  desc?: string;

  @IsString()
  @IsNotEmpty()
  image_url: string;

  @Type(() => ProductWeight)
  @ValidateNested()
  @IsOptional()
  weight?: ProductWeight;

  @Type(() => ProductVolume)
  @ValidateNested()
  @IsOptional()
  volume?: ProductVolume;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  categories_uuids: string[];

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  modifiers_uuids: string[];
}

export class UpdateProductDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @IsOptional()
  article_number?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  desc?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_url?: string;

  @Type(() => ProductWeight)
  @ValidateNested()
  @IsOptional()
  weight?: ProductWeight;

  @Type(() => ProductVolume)
  @ValidateNested()
  @IsOptional()
  volume?: ProductVolume;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  price?: number;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  @IsOptional()
  categories_uuids?: string[];

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  @IsOptional()
  modifiers_uuids?: string[];
}
