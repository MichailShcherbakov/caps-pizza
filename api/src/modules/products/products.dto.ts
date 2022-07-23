import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  article_number: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  desc?: string;

  @IsString()
  @IsNotEmpty()
  imageURL: string;
}

export class UpdateProductDto extends CreateProductDto {}
