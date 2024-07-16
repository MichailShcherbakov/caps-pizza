import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from "class-validator";

export class CreateProductCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image_url: string;

  @IsBoolean()
  @IsNotEmpty()
  display: boolean;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @IsOptional()
  display_position?: number;

  @IsUUID()
  @IsString()
  @IsOptional()
  parent_uuid?: string;
}

export class UpdateProductCategoryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

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

  @IsUUID()
  @IsString()
  @IsOptional()
  parent_uuid?: string;
}
