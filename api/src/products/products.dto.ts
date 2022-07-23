import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  desc?: string;

  @IsString()
  @IsNotEmpty()
  imageURL: string;
}
