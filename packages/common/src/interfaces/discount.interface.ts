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

export interface IDiscountСondition {
  criteria: DiscountCriteriaEnum;
  op: DiscountOperatorEnum;
  value: number;
  value2?: number;
}

export interface IDiscountModifier extends IModifier {}

export interface IDiscountProduct {
  product_uuid: string;
  product?: IProduct;
  modifiers: IDiscountModifier[];
}

export interface IDiscountProductCategory {
  category_uuid: string;
  category?: IProductCategory;
  modifiers: IDiscountModifier[];
}

export interface IProductWithFullPrice extends IProduct {
  count: number;
  fullPrice: number;
}
export interface IDiscount extends IEntity {
  name: string;
  type: DiscountTypeEnum;
  condition: IDiscountСondition;
  value: number;
  products: IDiscountProduct[];
  product_categories: IDiscountProductCategory[];
  modifiers: IDiscountModifier[];
}

export default IDiscount;
