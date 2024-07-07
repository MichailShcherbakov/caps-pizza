import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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
}
