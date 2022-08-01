import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { Column, Entity } from "typeorm";
import IEntity from "./entity.inteface";

export enum DiscountTypeEnum {
  PERCENT = "PERCENT",
  IN_CASH = "IN_CASH",
}

export enum DiscountCriteriaEnum {
  PRICE = "PRICE",
  COUNT = "COUNT",
}

export enum DiscountScopeEnum {
  PRODUCT = "PRODUCT",
  CATEGORY = "CATEGORY",
  GLOBAL = "GLOBAL",
}

export enum DiscountOperatorEnum {
  LESS = "LESS",
  GREATER = "GREATER",
  NOT_EQUAL = "NOT_EQUAL",
  EQUAL = "EQUAL",
  BETWEEN = "BETWEEN",
}

export class DiscountСondition {
  @IsNotEmpty()
  @IsEnum(DiscountCriteriaEnum)
  criteria: DiscountCriteriaEnum;

  @IsNotEmpty()
  @IsEnum(DiscountOperatorEnum)
  op: DiscountOperatorEnum;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number;
}

@Entity("discounts")
export default class DiscountEntity extends IEntity {
  @Column()
  name: string;

  @Column()
  type: DiscountTypeEnum;

  @Column()
  scope: DiscountScopeEnum;

  @Column({ type: "jsonb" })
  condition: DiscountСondition;

  @Column({ type: "float4" })
  value: number;
}
