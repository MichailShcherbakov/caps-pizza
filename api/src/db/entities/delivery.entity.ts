import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";
import { Column, Entity } from "typeorm";
import IEntity from "./entity.inteface";

export enum DeliveryTypeEnum {
  PERCENT = "PERCENT",
  IN_CASH = "IN_CASH",
}

export enum DeliveryCriteriaEnum {
  PRICE = "PRICE",
  COUNT = "COUNT",
}

export enum DeliveryOperatorEnum {
  EQUAL = "EQUAL",
  GREATER = "GREATER",
  LESS = "LESS",
  BETWEEN = "BETWEEN",
}

export class DeliveryСondition {
  @IsEnum(DeliveryCriteriaEnum)
  @IsNotEmpty()
  criteria: DeliveryCriteriaEnum;

  @IsEnum(DeliveryOperatorEnum)
  @IsNotEmpty()
  op: DeliveryOperatorEnum;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  value: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  value2?: number;
}

@Entity("deliveries")
export default class DeliveryEntity extends IEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: "int4", unique: true })
  article_number: number;

  @Column()
  type: DeliveryTypeEnum;

  @Column({ type: "jsonb" })
  condition: DeliveryСondition;

  @Column({ type: "float4" })
  value: number;

  static compare(a?: DeliveryEntity, b?: DeliveryEntity): number {
    if (!a && b) return 1;
    else if (a && !b) return -1;
    else if (!a || !b) return 0;
    else if (a.created_at < b.created_at) return -1;
    else if (a.created_at > b.created_at) return 1;
    return 0;
  }
}
