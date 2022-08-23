import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  code: number;
}

export class UpdatePaymentDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  code?: number;
}
