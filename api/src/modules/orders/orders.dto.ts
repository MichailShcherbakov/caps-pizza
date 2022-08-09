import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";

export class Modifier {
  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}

export class OrderedProduct {
  @IsUUID()
  @IsNotEmpty()
  uuid: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  count: number;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  modifiers: Modifier[];
}

export class DeliveryAddress {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  street: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  house: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  entrance: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  floor: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @IsNotEmpty()
  apartment: number;
}

export class ClientInfo {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsPhoneNumber("RU")
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @MaxLength(50)
  @IsOptional()
  mail?: string;
}

export enum PaymentTypeEnum {
  IN_CASH = "IN_CASH",
  BY_CARD = "BY_CARD",
}

export class Payment {
  @IsEnum(PaymentTypeEnum)
  @IsNotEmpty()
  type: PaymentTypeEnum;
}

export class Order {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  products: OrderedProduct[];

  @ValidateNested()
  @IsNotEmpty()
  delivery_address: DeliveryAddress;

  @IsNumber()
  @Min(0)
  @IsOptional()
  score?: number;

  @IsNumber({ maxDecimalPlaces: 16 })
  @Min(0)
  @IsOptional()
  card?: number;

  @ValidateNested()
  @IsNotEmpty()
  client_info: ClientInfo;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  payment: Payment;
}

export class MakeAnOrderDto extends Order {}

export class FrontPadPayload {
  product: Record<number, number>;
  product_kol: Record<number, number>;
  product_price: Record<number, number>;
  product_mod: Record<number, number>;
  score?: number;
  sale?: number;
  sale_amount?: number;
  card?: number;
  street?: string;
  home?: string;
  pod?: number;
  et?: number;
  apart?: number;
  phone?: string;
  mail?: string;
  descr?: string;
  name?: string;
  pay?: string;
  certificate?: number;
  person?: number;
  tags?: number[];
  hook_status?: number[];
  hook_url?: string;
  channel?: number;
  datetime?: string;
  affiliate?: string;
  point?: string;
}

export class FrontPadResponse {
  order_id: number;
  order_number: number;
}
