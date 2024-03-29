import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from "class-validator";

export class CreateModifierDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
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

  @IsBoolean()
  @IsNotEmpty()
  display: boolean;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @IsOptional()
  display_position?: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  category_uuid: string;
}

export class UpdateModifierDto {
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
  @IsNotEmpty()
  @IsOptional()
  desc?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_url?: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  display?: boolean;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @IsOptional()
  display_position?: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  category_uuid?: string;
}
