import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
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

  @IsArray()
  @IsNotEmpty()
  modifier: Modifier[];
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

  @IsNumber({ maxDecimalPlaces: 50 })
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
  mail?: string;
}

export enum PaymentType {
  IN_CASH = "IN_CASH",
  BY_CARD = "BY_CARD",
}

export class Payment {
  @IsEnum(PaymentType)
  @IsNotEmpty()
  type: PaymentType;
}

export class MakeAnOrderDto {
  @IsNotEmpty()
  @IsArray()
  products: OrderedProduct[];

  @IsNotEmpty()
  delivery_address: DeliveryAddress;

  @IsNumber()
  @IsPositive()
  score?: number;

  @IsNumber({ maxDecimalPlaces: 16 })
  @IsPositive()
  card?: number;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  description?: string;

  @IsNotEmpty()
  payment: Payment;
}
