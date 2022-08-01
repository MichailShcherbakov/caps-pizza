import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image_url: string;
}
