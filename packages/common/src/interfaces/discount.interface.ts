import IEntity from "./entity.interface";
import IModifier from "./modifier.interface";
import IProductCategory from "./product-category.interface";
import IProduct from "./product.interface";

export enum DiscountTypeEnum {
  PERCENT = "PERCENT",
  IN_CASH = "IN_CASH",
  FIXED_PRICE = "FIXED_PRICE",
}

export enum DiscountCriteriaEnum {
  PRICE = "PRICE",
  COUNT = "COUNT",
}

export enum DiscountOperatorEnum {
  LESS = "LESS",
  GREATER = "GREATER",
  EQUAL = "EQUAL",
  BETWEEN = "BETWEEN",
}

export interface IDiscountCondition {
  criteria: DiscountCriteriaEnum;
  op: DiscountOperatorEnum;
  value: number;
  value2?: number;
}

export interface IProductWithFullPrice extends IProduct {
  count: number;
  fullPrice: number;
}

export interface IDiscountStrategy {
  condition: IDiscountCondition;
  /// scope
  products: IProduct[];
  product_categories: IProductCategory[];
  modifiers: IModifier[];
}

export interface IDiscount extends IEntity {
  name: string;
  type: DiscountTypeEnum;
  strategies: IDiscountStrategy[];
  value: number;
}

export default IDiscount;
