import { faker } from "@faker-js/faker";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
  IDiscount,
} from "./../../../../interfaces";

export const createDiscount = (options: Partial<IDiscount> = {}): IDiscount => {
  return {
    uuid: faker.datatype.uuid(),
    name: faker.datatype.string(),
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
