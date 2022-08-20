import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import {
  DeliveryTypeEnum,
  DeliveryСondition,
} from "~/db/entities/delivery.entity";

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  article_number: number;

  @IsEnum(DeliveryTypeEnum)
  @IsNotEmpty()
  type: DeliveryTypeEnum;

  @ValidateNested()
  condition: DeliveryСondition;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  value: number;
}

export class UpdateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  article_number?: number;

  @IsEnum(DeliveryTypeEnum)
  @IsNotEmpty()
  @IsOptional()
  type?: DeliveryTypeEnum;

  @ValidateNested()
  @IsOptional()
  condition?: DeliveryСondition;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  value?: number;
}
