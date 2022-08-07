import DiscountEntity, {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
  DiscountСondition,
} from "~/db/entities/discount.entity";
import ProductEntity from "~/db/entities/product.entity";
import { Order, OrderedProduct } from "~/modules/orders/orders.dto";
import { TEST_TRADITIONAL_DOUGH_MODIFIER } from "../../data/modifiers.data";
import {
  TEST_PIZZA_PRODUCT_CATEGORY,
  TEST_ROLL_PRODUCT_CATEGORY,
} from "../../data/product-categories.data";
import computeFinalOrderCostHelper from "../../helpers/compute-final-order-cost.helper";
import createDiscountHelper from "../../helpers/create-discount.helper";
import createProductHelper from "../../helpers/create-product.helper";
import {
  discountsServiceWrapper,
  modifiersServiceWrapper,
  productsServiceWrapper,
} from "../../__mocks__/discounts.service";

const testTemplate1 = async (
  discountOptions: {
    type: DiscountTypeEnum;
    value: number;
    condition: DiscountСondition;
  },
  counts: [number, number],
  computeTruthyPrice: (
    products: (ProductEntity & { full_price: number })[],
    discount: DiscountEntity,
    finalCostOrder: number
  ) => number
) => {
  const product = createProductHelper({
    price: 440,
    modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
    category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
    category: TEST_PIZZA_PRODUCT_CATEGORY,
  });

  const product2 = createProductHelper({
    price: 220,
    modifiers: [],
    category_uuid: TEST_ROLL_PRODUCT_CATEGORY.uuid,
    category: TEST_ROLL_PRODUCT_CATEGORY,
  });

  const discount = createDiscountHelper({
    type: discountOptions.type,
    value: discountOptions.value,
    condition: discountOptions.condition,
    scope: DiscountScopeEnum.GLOBAL,
    products: [],
    product_categories: [],
  });

  jest
    .spyOn(productsServiceWrapper, "find")
    .mockResolvedValueOnce([product, product2]);

  jest.spyOn(discountsServiceWrapper, "find").mockResolvedValueOnce([discount]);

  jest
    .spyOn(modifiersServiceWrapper, "find")
    .mockResolvedValueOnce([TEST_TRADITIONAL_DOUGH_MODIFIER]);

  const orderedProducts: OrderedProduct[] = [
    {
      uuid: product.uuid,
      count: counts[0],
      modifiers: product.modifiers,
    },
    {
      uuid: product2.uuid,
      count: counts[1],
      modifiers: product2.modifiers,
    },
  ];

  const finalCostOrder = computeFinalOrderCostHelper(
    [product, product2],
    [counts[0], counts[1]],
    [product.modifiers, product2.modifiers]
  );

  const calculatedDiscount = await discountsServiceWrapper.calculate({
    products: orderedProducts,
  } as Order);

  expect(calculatedDiscount?.type).toEqual(DiscountTypeEnum.IN_CASH);
  expect(calculatedDiscount?.value).toEqual(
    (
      finalCostOrder -
      computeTruthyPrice([product, product2], discount, finalCostOrder)
    ).toFixedFloat(2)
  );
};

const testTemplate2 = async (
  discountOptions: {
    type: DiscountTypeEnum;
    value: number;
    condition: DiscountСondition;
  },
  counts: [number, number]
) => {
  const product = createProductHelper({
    price: 440,
    modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
    category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
    category: TEST_PIZZA_PRODUCT_CATEGORY,
  });

  const product2 = createProductHelper({
    price: 220,
    modifiers: [],
    category_uuid: TEST_ROLL_PRODUCT_CATEGORY.uuid,
    category: TEST_ROLL_PRODUCT_CATEGORY,
  });

  const discount = createDiscountHelper({
    type: discountOptions.type,
    value: discountOptions.value,
    condition: discountOptions.condition,
    scope: DiscountScopeEnum.GLOBAL,
    products: [],
    product_categories: [],
  });

  jest
    .spyOn(productsServiceWrapper, "find")
    .mockResolvedValueOnce([product, product2]);

  jest.spyOn(discountsServiceWrapper, "find").mockResolvedValueOnce([discount]);

  jest
    .spyOn(modifiersServiceWrapper, "find")
    .mockResolvedValueOnce([TEST_TRADITIONAL_DOUGH_MODIFIER]);

  const orderedProducts: OrderedProduct[] = [
    {
      uuid: product.uuid,
      count: counts[0],
      modifiers: product.modifiers,
    },
    {
      uuid: product2.uuid,
      count: counts[1],
      modifiers: product2.modifiers,
    },
  ];

  const calculatedDiscount = await discountsServiceWrapper.calculate({
    products: orderedProducts,
  } as Order);

  expect(calculatedDiscount).toBeNull();
};

describe("[Unit] [Discounts Module] ...", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe(`[SCOPE: ${DiscountScopeEnum.GLOBAL}] ...`, () => {
    describe(`[CRITERIA: ${DiscountCriteriaEnum.COUNT}] ...`, () => {
      describe(`[OP: ${DiscountOperatorEnum.EQUAL}]`, () => {
        describe("[strict comparison]", () => {
          it("should provide a percent discount for a special product", async () => {
            await testTemplate1(
              {
                type: DiscountTypeEnum.PERCENT,
                value: 3,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              [1, 3],
              (_, discount, totalOrderCost) => {
                return totalOrderCost - (totalOrderCost * discount.value) / 100;
              }
            );
          });

          it("should provide a in cash discount for a special product", async () => {
            await testTemplate1(
              {
                type: DiscountTypeEnum.IN_CASH,
                value: 220,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 5,
                },
              },
              [1, 5],
              (_, discount, totalOrderCost) => totalOrderCost - discount.value
            );
          });

          it("should provide a fixed price discount for a special product", async () => {
            await testTemplate2(
              {
                type: DiscountTypeEnum.FIXED_PRICE,
                value: 1000,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 5,
                },
              },
              [1, 5]
            );
          });
        });

        describe("[not strict comparison]", () => {
          it("should provide a percent discount for a special product", async () => {
            await testTemplate1(
              {
                type: DiscountTypeEnum.PERCENT,
                value: 3,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              [1, 7],
              (_, discount, totalOrderCost) =>
                totalOrderCost - (totalOrderCost * discount.value) / 100
            );
          });

          it("should provide a in cash discount for a special product", async () => {
            await testTemplate1(
              {
                type: DiscountTypeEnum.IN_CASH,
                value: 220,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 5,
                },
              },
              [1, 12],
              (_, discount, totalOrderCost) => totalOrderCost - discount.value
            );
          });

          it("should provide a fixed price discount for a special product", async () => {
            await testTemplate2(
              {
                type: DiscountTypeEnum.FIXED_PRICE,
                value: 1000,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 5,
                },
              },
              [1, 8]
            );
          });
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.GREATER}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testTemplate1(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.GREATER,
                value: 5,
              },
            },
            [1, 7],
            (_, discount, finalOrderCost) =>
              finalOrderCost - (finalOrderCost * discount.value) / 100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testTemplate1(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.GREATER,
                value: 5,
              },
            },
            [1, 7],
            (_, discount, totalOrderCost) => totalOrderCost - discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testTemplate2(
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.GREATER,
                value: 5,
              },
            },
            [1, 12]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.LESS}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testTemplate1(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.LESS,
                value: 5,
              },
            },
            [1, 2],
            (_, discount, totalOrderCost) =>
              totalOrderCost - (totalOrderCost * discount.value) / 100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testTemplate1(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.LESS,
                value: 5,
              },
            },
            [1, 3],
            (_, discount, totalOrderCost) => totalOrderCost - discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testTemplate2(
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.LESS,
                value: 5,
              },
            },
            [1, 4]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.BETWEEN}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testTemplate1(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.BETWEEN,
                value: 5,
                value2: 10,
              },
            },
            [1, 7],
            (_, discount, totalOrderCost) =>
              totalOrderCost - (totalOrderCost * discount.value) / 100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testTemplate1(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.BETWEEN,
                value: 5,
                value2: 10,
              },
            },
            [1, 6],
            (_, discount, totalOrderCost) => totalOrderCost - discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testTemplate2(
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.BETWEEN,
                value: 10,
                value2: 12,
              },
            },
            [1, 11]
          );
        });
      });
    });

    describe(`[CRITERIA: ${DiscountCriteriaEnum.PRICE}] ...`, () => {
      describe(`[OP: ${DiscountOperatorEnum.EQUAL}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testTemplate1(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.EQUAL,
                value: 2030, // total order cost
              },
            },
            [1, 7],
            (_, discount, totalOrderCost) =>
              totalOrderCost - (totalOrderCost * discount.value) / 100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testTemplate1(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.EQUAL,
                value: 2030, // total order cost
              },
            },
            [1, 7],
            (_, discount, totalOrderCost) => totalOrderCost - discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testTemplate2(
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.EQUAL,
                value: 2030, // total order cost
              },
            },
            [1, 7]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.GREATER}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testTemplate1(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.GREATER,
                value: 1000,
              },
            },
            [1, 7],
            (_, discount, totalOrderCost) =>
              totalOrderCost - (totalOrderCost * discount.value) / 100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testTemplate1(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.GREATER,
                value: 1000,
              },
            },
            [1, 7],
            (_, discount, totalOrderCost) => totalOrderCost - discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testTemplate2(
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.GREATER,
                value: 1000,
              },
            },
            [1, 12]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.LESS}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testTemplate1(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.LESS,
                value: 10000,
              },
            },
            [1, 2],
            (_, discount, totalOrderCost) =>
              totalOrderCost - (totalOrderCost * discount.value) / 100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testTemplate1(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.LESS,
                value: 10000,
              },
            },
            [1, 3],
            (_, discount, totalOrderCost) => totalOrderCost - discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testTemplate2(
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.LESS,
                value: 10000,
              },
            },
            [1, 4]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.BETWEEN}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testTemplate1(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.BETWEEN,
                value: 0,
                value2: 5000,
              },
            },
            [1, 7],
            (_, discount, totalOrderCost) =>
              totalOrderCost - (totalOrderCost * discount.value) / 100
          );
        });

        it("should provide a in cash discount for a special product (Invalid discount)", async () => {
          await testTemplate1(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.BETWEEN,
                value: 0,
                value2: 5000,
              },
            },
            [1, 6],
            (_, discount, totalOrderCost) => totalOrderCost - discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testTemplate2(
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.BETWEEN,
                value: 0,
                value2: 5000,
              },
            },
            [1, 7]
          );
        });
      });
    });
  });
});
