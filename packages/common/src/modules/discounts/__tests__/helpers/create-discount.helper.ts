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
    name: faker.datatype.uuid(),
    strategies: [
      {
        condition: {
          criteria: DiscountCriteriaEnum.COUNT,
          op: DiscountOperatorEnum.EQUAL,
          value: 3,
        },
        products: [],
        product_categories: [],
        modifiers: [],
      },
    ],
    type: DiscountTypeEnum.FIXED_PRICE,
    value: 1199,
    ...options,
  };
};

export default createDiscount;
