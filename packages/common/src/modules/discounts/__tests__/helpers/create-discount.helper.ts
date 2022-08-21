import { faker } from "@faker-js/faker";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
  IDiscount,
} from "./../../../../interfaces";

export const createDiscount = (options: Partial<IDiscount> = {}): IDiscount => {
  return {
    uuid: faker.datatype.uuid(),
    name: faker.datatype.string(),
    scope: DiscountScopeEnum.PRODUCT_FEATURES,
    condition: {
      criteria: DiscountCriteriaEnum.COUNT,
      op: DiscountOperatorEnum.EQUAL,
      value: 3,
    },
    type: DiscountTypeEnum.FIXED_PRICE,
    value: 1199,
    products: [],
    product_categories: [],
    modifiers: [],
    ...options,
  };
};

export default createDiscount;
