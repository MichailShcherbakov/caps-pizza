import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
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
  price: number;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  category_uuid: string;
}
