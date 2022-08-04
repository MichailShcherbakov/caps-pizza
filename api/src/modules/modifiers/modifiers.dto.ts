import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from "class-validator";

export class CreateModifierDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  article_number: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  desc?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_url?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @IsOptional()
  display_position?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  category_uuid: string;
}

export class UpdateModifierDto {
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
  @IsNotEmpty()
  @IsOptional()
  desc?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_url?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @IsOptional()
  display_position?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  category_uuid?: string;
}
