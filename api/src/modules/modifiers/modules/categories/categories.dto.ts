import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateModifierCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_url?: string;
}
