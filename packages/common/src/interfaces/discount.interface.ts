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

export enum DiscountScopeEnum {
  PRODUCTS = "PRODUCTS",
  PRODUCT_FEATURES = "PRODUCT_FEATURES",
  GLOBAL = "GLOBAL",
}

export enum DiscountOperatorEnum {
  LESS = "LESS",
  GREATER = "GREATER",
  EQUAL = "EQUAL",
  BETWEEN = "BETWEEN",
}

export interface IDiscountСondition {
  criteria: DiscountCriteriaEnum;
  op: DiscountOperatorEnum;
  value: number;
  value2?: number;
}

export interface IDiscount extends IEntity {
  name: string;
  type: DiscountTypeEnum;
  scope: DiscountScopeEnum;
  condition: IDiscountСondition;
  value: number;
  products: IProduct[];
  product_categories: IProductCategory[];
  modifiers: IModifier[];
}

export default IDiscount;
