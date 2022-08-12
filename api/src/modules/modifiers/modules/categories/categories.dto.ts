import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreateModifierCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_url?: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @IsOptional()
  display_position?: number;
}

export class UpdateModifierCategoryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_url?: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @IsOptional()
  display_position?: number;
}
