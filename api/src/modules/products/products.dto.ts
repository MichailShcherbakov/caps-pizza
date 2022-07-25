import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
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

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  category_uuid: string;
}

export class UpdateProductDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
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

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  category_uuid?: string;
}
