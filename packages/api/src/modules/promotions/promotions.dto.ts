import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreatePromotionDto {
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
  @Min(0)
  @Max(99999)
  @IsNotEmpty()
  display_position: number;
}

export class UpdatePromotionDto {
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
  @IsOptional()
  display?: boolean;

  @IsNumber()
  @Min(0)
  @Max(99999)
  @IsNotEmpty()
  @IsOptional()
  display_position?: number;
}
