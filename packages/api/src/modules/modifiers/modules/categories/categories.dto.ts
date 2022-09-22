import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import {
  ModifierCategoryChoiceOptionEnum,
  ModifierCategoryDisplayVariantEnum,
} from "@monorepo/common";

export class CreateModifierCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_url?: string;

  @IsEnum(ModifierCategoryChoiceOptionEnum)
  @IsNotEmpty()
  choice_option: ModifierCategoryChoiceOptionEnum;

  @IsBoolean()
  @IsNotEmpty()
  display: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  display_name?: string;

  @IsEnum(ModifierCategoryDisplayVariantEnum)
  @IsNotEmpty()
  display_variant: ModifierCategoryDisplayVariantEnum;

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

  @IsEnum(ModifierCategoryChoiceOptionEnum)
  @IsNotEmpty()
  @IsOptional()
  choice_option?: ModifierCategoryChoiceOptionEnum;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  display?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  display_name?: string;

  @IsEnum(ModifierCategoryDisplayVariantEnum)
  @IsNotEmpty()
  @IsOptional()
  display_variant?: ModifierCategoryDisplayVariantEnum;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @IsOptional()
  display_position?: number;
}
