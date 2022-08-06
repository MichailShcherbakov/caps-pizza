import DiscountEntity, {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
} from "~/db/entities/discount.entity";
import TEST_PRODUCT_CATEGORIES from "./product-categories.data";
import TEST_PRODUCTS from "./products.data";

export const TEST_DISCOUNTS: DiscountEntity[] = [
  {
    uuid: "0",
    name: "10% greater 5000",
    type: DiscountTypeEnum.PERCENT,
    value: 10,
    condition: {
      criteria: DiscountCriteriaEnum.PRICE,
      op: DiscountOperatorEnum.GREATER,
      value: 5000,
    },
    scope: DiscountScopeEnum.GLOBAL,
    products: [],
    product_categories: [],
    updated_at: new Date(),
    created_at: new Date(),
  },
  {
    uuid: "1",
    name: "3 pizzas by 1199",
    type: DiscountTypeEnum.FIXED_PRICE,
    value: 1199,
    condition: {
      criteria: DiscountCriteriaEnum.COUNT,
      op: DiscountOperatorEnum.EQUAL,
      value: 3,
    },
    scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
    products: [],
    product_categories: [TEST_PRODUCT_CATEGORIES[0]],
    updated_at: new Date(),
    created_at: new Date(),
  },
  {
    uuid: "2",
    name: "5% greater 3000",
    type: DiscountTypeEnum.PERCENT,
    value: 5,
    condition: {
      criteria: DiscountCriteriaEnum.PRICE,
      op: DiscountOperatorEnum.GREATER,
      value: 3000,
    },
    scope: DiscountScopeEnum.GLOBAL,
    products: [],
    product_categories: [],
    updated_at: new Date(),
    created_at: new Date(),
  },
  {
    uuid: "3",
    name: "100 for №3 Pizza",
    type: DiscountTypeEnum.IN_CASH,
    value: 100,
    condition: {
      criteria: DiscountCriteriaEnum.COUNT,
      op: DiscountOperatorEnum.EQUAL,
      value: 1,
    },
    scope: DiscountScopeEnum.PRODUCTS,
    products: [TEST_PRODUCTS[0]],
    product_categories: [],
    updated_at: new Date(),
    created_at: new Date(),
  },
  /*  {
    uuid: "4",
    name: "3% For Roll #2",
    type: DiscountTypeEnum.PERCENT,
    value: 3,
    condition: {
      criteria: DiscountCriteriaEnum.COUNT,
      op: DiscountOperatorEnum.EQUAL,
      value: 1,
    },
    scope: DiscountScopeEnum.PRODUCTS,
    products: [TEST_PRODUCTS[4]],
    product_categories: [],
    updated_at: new Date(),
    created_at: new Date(),
  }, */
];

export default TEST_DISCOUNTS;
