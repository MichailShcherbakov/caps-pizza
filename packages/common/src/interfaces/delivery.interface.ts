import IEntity from "./entity.interface";

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

export interface IDeliveryCondition {
  criteria: DeliveryCriteriaEnum;
  op: DeliveryOperatorEnum;
  value: number;
  value2?: number;
}

export interface IDelivery extends IEntity {
  name: string;
  article_number: number;
  type: DeliveryTypeEnum;
  condition: IDeliveryCondition;
  value: number;
}
export default IDelivery;
