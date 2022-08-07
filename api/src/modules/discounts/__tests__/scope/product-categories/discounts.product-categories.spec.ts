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
  const specialCategoryProduct = createProductHelper({
    price: 440,
    modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
    category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
    category: TEST_PIZZA_PRODUCT_CATEGORY,
  });

  const otherCategoryProduct = createProductHelper({
    price: 220,
    modifiers: [],
    category_uuid: TEST_ROLL_PRODUCT_CATEGORY.uuid,
    category: TEST_ROLL_PRODUCT_CATEGORY,
  });

  const discount = createDiscountHelper({
    type: discountOptions.type,
    value: discountOptions.value,
    condition: discountOptions.condition,
    scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
    products: [],
    product_categories: [TEST_PIZZA_PRODUCT_CATEGORY],
  });

  jest
    .spyOn(productsServiceWrapper, "find")
    .mockResolvedValueOnce([specialCategoryProduct, otherCategoryProduct]);

  jest.spyOn(discountsServiceWrapper, "find").mockResolvedValueOnce([discount]);

  jest
    .spyOn(modifiersServiceWrapper, "find")
    .mockResolvedValueOnce([TEST_TRADITIONAL_DOUGH_MODIFIER]);

  const orderedProducts: OrderedProduct[] = [
    {
      uuid: otherCategoryProduct.uuid,
      count: counts[0],
      modifiers: otherCategoryProduct.modifiers,
    },
    {
      uuid: specialCategoryProduct.uuid,
      count: counts[1],
      modifiers: specialCategoryProduct.modifiers,
    },
  ];

  const finalCostOrder = computeFinalOrderCostHelper(
    [otherCategoryProduct, specialCategoryProduct],
    [counts[0], counts[1]],
    [otherCategoryProduct.modifiers, specialCategoryProduct.modifiers]
  );

  const calculatedDiscount = await discountsServiceWrapper.calculate({
    products: orderedProducts,
  } as Order);

  expect(calculatedDiscount?.type).toEqual(DiscountTypeEnum.IN_CASH);
  expect(calculatedDiscount?.value).toEqual(
    finalCostOrder -
      computeTruthyPrice(
        [otherCategoryProduct, specialCategoryProduct],
        discount,
        finalCostOrder
      )
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
  const specialCategoryProduct = createProductHelper({
    price: 440,
    modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
    category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
    category: TEST_PIZZA_PRODUCT_CATEGORY,
  });

  const otherCategoryProduct = createProductHelper({
    price: 220,
    modifiers: [],
    category_uuid: TEST_ROLL_PRODUCT_CATEGORY.uuid,
    category: TEST_ROLL_PRODUCT_CATEGORY,
  });

  const discount = createDiscountHelper({
    type: discountOptions.type,
    value: discountOptions.value,
    condition: discountOptions.condition,
    scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
    products: [],
    product_categories: [TEST_PIZZA_PRODUCT_CATEGORY],
  });

  jest
    .spyOn(productsServiceWrapper, "find")
    .mockResolvedValueOnce([specialCategoryProduct, otherCategoryProduct]);

  jest.spyOn(discountsServiceWrapper, "find").mockResolvedValueOnce([discount]);

  jest
    .spyOn(modifiersServiceWrapper, "find")
    .mockResolvedValueOnce([TEST_TRADITIONAL_DOUGH_MODIFIER]);

  const orderedProducts: OrderedProduct[] = [
    {
      uuid: otherCategoryProduct.uuid,
      count: counts[0],
      modifiers: otherCategoryProduct.modifiers,
    },
    {
      uuid: specialCategoryProduct.uuid,
      count: counts[1],
      modifiers: specialCategoryProduct.modifiers,
    },
  ];

  const calculatedDiscount = await discountsServiceWrapper.calculate({
    products: orderedProducts,
  } as Order);

  expect(calculatedDiscount).toBeNull();
};

const testTemplate3 = async (
  discountOptions: {
    type: DiscountTypeEnum;
    value: number;
    condition: DiscountСondition;
  },
  counts: [number, number, number],
  computeTruthyPrice: (
    products: (ProductEntity & { full_price: number })[],
    discount: DiscountEntity,
    finalCostOrder: number
  ) => number
) => {
  const specialCategoryProduct = createProductHelper({
    price: 440,
    modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
    category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
    category: TEST_PIZZA_PRODUCT_CATEGORY,
  });

  const specialCategoryProduct2 = createProductHelper({
    price: 510,
    modifiers: [TEST_TRADITIONAL_DOUGH_MODIFIER],
    category_uuid: TEST_PIZZA_PRODUCT_CATEGORY.uuid,
    category: TEST_PIZZA_PRODUCT_CATEGORY,
  });

  const otherCategoryProduct = createProductHelper({
    price: 220,
    modifiers: [],
    category_uuid: TEST_ROLL_PRODUCT_CATEGORY.uuid,
    category: TEST_ROLL_PRODUCT_CATEGORY,
  });

  const discount = createDiscountHelper({
    type: discountOptions.type,
    value: discountOptions.value,
    condition: discountOptions.condition,
    scope: DiscountScopeEnum.PRODUCT_CATEGORIES,
    products: [],
    product_categories: [TEST_PIZZA_PRODUCT_CATEGORY],
  });

  jest
    .spyOn(productsServiceWrapper, "find")
    .mockResolvedValueOnce([
      specialCategoryProduct,
      otherCategoryProduct,
      specialCategoryProduct2,
    ]);

  jest.spyOn(discountsServiceWrapper, "find").mockResolvedValueOnce([discount]);

  jest
    .spyOn(modifiersServiceWrapper, "find")
    .mockResolvedValueOnce([TEST_TRADITIONAL_DOUGH_MODIFIER]);

  const orderedProducts: OrderedProduct[] = [
    {
      uuid: otherCategoryProduct.uuid,
      count: counts[0],
      modifiers: otherCategoryProduct.modifiers,
    },
    {
      uuid: specialCategoryProduct.uuid,
      count: counts[1],
      modifiers: specialCategoryProduct.modifiers,
    },
    {
      uuid: specialCategoryProduct2.uuid,
      count: counts[2],
      modifiers: specialCategoryProduct2.modifiers,
    },
  ];

  const finalCostOrder = computeFinalOrderCostHelper(
    [otherCategoryProduct, specialCategoryProduct, specialCategoryProduct2],
    [counts[0], counts[1], counts[2]],
    [
      otherCategoryProduct.modifiers,
      specialCategoryProduct.modifiers,
      specialCategoryProduct2.modifiers,
    ]
  );

  const calculatedDiscount = await discountsServiceWrapper.calculate({
    products: orderedProducts,
  } as Order);

  expect(calculatedDiscount?.type).toEqual(DiscountTypeEnum.IN_CASH);
  expect(calculatedDiscount?.value).toEqual(
    finalCostOrder -
      computeTruthyPrice(
        [otherCategoryProduct, specialCategoryProduct, specialCategoryProduct2],
        discount,
        finalCostOrder
      )
  );
};

describe("[Unit] [Discounts Module] ...", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe(`[SCOPE: ${DiscountScopeEnum.PRODUCT_CATEGORIES}] ...`, () => {
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
              ([notSpecialProduct, specialProduct], discount) =>
                notSpecialProduct.full_price +
                (specialProduct.full_price * 3 * discount.value) / 100
            );
            await testTemplate3(
              {
                type: DiscountTypeEnum.PERCENT,
                value: 3,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              [1, 3, 3],
              (
                [notSpecialProduct, specialProduct, specialProduct2],
                discount
              ) =>
                notSpecialProduct.full_price +
                (specialProduct.full_price * 3 * discount.value) / 100 +
                (specialProduct2.full_price * 3 * discount.value) / 100
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
              ([notSpecialProduct, specialProduct], discount) =>
                notSpecialProduct.full_price +
                (specialProduct.full_price * 5 - discount.value)
            );
            await testTemplate3(
              {
                type: DiscountTypeEnum.IN_CASH,
                value: 220,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 5,
                },
              },
              [1, 5, 5],
              (
                [notSpecialProduct, specialProduct, specialProduct2],
                discount
              ) =>
                notSpecialProduct.full_price +
                (specialProduct.full_price * 5 - discount.value) +
                (specialProduct2.full_price * 5 - discount.value)
            );
          });

          it("should provide a fixed price discount for a special product", async () => {
            await testTemplate1(
              {
                type: DiscountTypeEnum.FIXED_PRICE,
                value: 1000,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 5,
                },
              },
              [1, 5],
              ([notSpecialProduct], discount) =>
                notSpecialProduct.full_price + discount.value
            );
            await testTemplate3(
              {
                type: DiscountTypeEnum.FIXED_PRICE,
                value: 1000,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 5,
                },
              },
              [1, 5, 5],
              ([notSpecialProduct], discount) =>
                notSpecialProduct.full_price + discount.value + discount.value
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
              ([notSpecialProduct, specialProduct], discount) =>
                notSpecialProduct.full_price +
                specialProduct.full_price * 1 +
                (specialProduct.full_price * 6 * discount.value) / 100
            );
            await testTemplate3(
              {
                type: DiscountTypeEnum.PERCENT,
                value: 3,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              [1, 7, 7],
              (
                [notSpecialProduct, specialProduct, specialProduct2],
                discount
              ) =>
                notSpecialProduct.full_price +
                specialProduct.full_price * 1 +
                (specialProduct.full_price * 6 * discount.value) / 100 +
                specialProduct2.full_price * 1 +
                (specialProduct2.full_price * 6 * discount.value) / 100
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
              ([notSpecialProduct, specialProduct], discount) =>
                notSpecialProduct.full_price +
                specialProduct.full_price * 2 +
                (specialProduct.full_price * 10 - discount.value)
            );
            await testTemplate3(
              {
                type: DiscountTypeEnum.IN_CASH,
                value: 220,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 5,
                },
              },
              [1, 12, 12],
              (
                [notSpecialProduct, specialProduct, specialProduct2],
                discount
              ) =>
                notSpecialProduct.full_price +
                specialProduct.full_price * 2 +
                (specialProduct.full_price * 10 - discount.value) +
                specialProduct2.full_price * 2 +
                (specialProduct2.full_price * 10 - discount.value)
            );
          });

          it("should provide a fixed price discount for a special product", async () => {
            await testTemplate1(
              {
                type: DiscountTypeEnum.FIXED_PRICE,
                value: 1000,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 5,
                },
              },
              [1, 8],
              ([notSpecialProduct, specialProduct], discount) =>
                notSpecialProduct.full_price +
                specialProduct.full_price * 3 +
                discount.value
            );
            await testTemplate3(
              {
                type: DiscountTypeEnum.FIXED_PRICE,
                value: 1000,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 5,
                },
              },
              [1, 8, 8],
              (
                [notSpecialProduct, specialProduct, specialProduct2],
                discount
              ) =>
                notSpecialProduct.full_price +
                specialProduct.full_price * 3 +
                discount.value +
                specialProduct2.full_price * 3 +
                discount.value
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
            ([notSpecialProduct, specialProduct], discount) =>
              notSpecialProduct.full_price +
              (specialProduct.full_price * 7 * discount.value) / 100
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
            ([notSpecialProduct, specialProduct], discount) =>
              notSpecialProduct.full_price +
              (specialProduct.full_price * 2 * discount.value) / 100
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
            ([notSpecialProduct, specialProduct], discount) =>
              notSpecialProduct.full_price +
              (specialProduct.full_price * 7 * discount.value) / 100
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
                value: 1000,
              },
            },
            [1, 3],
            ([otherCategoryProduct, specialCategoryProduct], discount) =>
              otherCategoryProduct.full_price +
              specialCategoryProduct.full_price * 3 -
              (specialCategoryProduct.full_price * 3 * discount.value) / 100
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
                value: 1000,
              },
            },
            [1, 5],
            ([otherCategoryProduct, specialCategoryProduct], discount) =>
              otherCategoryProduct.full_price +
              specialCategoryProduct.full_price * 5 -
              discount.value * 2
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
                value: 1000,
              },
            },
            [1, 5]
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
            [1, 5],
            ([otherCategoryProduct, specialCategoryProduct], discount) =>
              otherCategoryProduct.full_price +
              specialCategoryProduct.full_price * 5 -
              (specialCategoryProduct.full_price * 5 * discount.value) / 100
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
            [1, 5],
            ([otherCategoryProduct, specialCategoryProduct], discount) =>
              otherCategoryProduct.full_price +
              specialCategoryProduct.full_price * 5 -
              discount.value * 2
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
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.LESS,
                value: 1000,
              },
            },
            [1, 2],
            ([otherCategoryProduct, specialCategoryProduct], discount) =>
              otherCategoryProduct.full_price +
              specialCategoryProduct.full_price * 2 -
              (specialCategoryProduct.full_price * 2 * discount.value) / 100
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
                value: 1000,
              },
            },
            [1, 2],
            ([otherCategoryProduct, specialCategoryProduct], discount) =>
              otherCategoryProduct.full_price +
              specialCategoryProduct.full_price * 2 -
              discount.value
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
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.BETWEEN,
                value: 500,
                value2: 1000,
              },
            },
            [1, 2],
            ([otherCategoryProduct, specialCategoryProduct], discount) =>
              otherCategoryProduct.full_price +
              specialCategoryProduct.full_price * 2 -
              (specialCategoryProduct.full_price * 2 * discount.value) / 100
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
                value: 500,
                value2: 1000,
              },
            },
            [1, 2],
            ([otherCategoryProduct, specialCategoryProduct], discount) =>
              otherCategoryProduct.full_price +
              specialCategoryProduct.full_price * 2 -
              discount.value
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
                value: 10,
                value2: 12,
              },
            },
            [1, 11]
          );
        });
      });
    });
  });
});
