import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
} from "~/db/entities/discount.entity";
import {
  testInvalidDiscount,
  testValidDiscountWithModifiers,
  testValidDiscountWithOnlyModifiers,
  testValidDiscountWithProductCategories,
} from "./templates";

describe("[Unit] [Discounts Module] ...", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe(`[SCOPE: ${DiscountScopeEnum.PRODUCT_FEATURES}] ...`, () => {
    describe(`[CRITERIA: ${DiscountCriteriaEnum.COUNT}] ...`, () => {
      describe(`[OP: ${DiscountOperatorEnum.EQUAL}]`, () => {
        describe("[strict comparison]", () => {
          it("should provide a percent discount for a special product", async () => {
            await testValidDiscountWithProductCategories(
              {
                type: DiscountTypeEnum.PERCENT,
                value: 3,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              // 590 490 610
              [1, 2, 0, 0],
              (discount, [product1, product2]) =>
                ((product1.final_cost + product2.final_cost) * discount.value) /
                100
            );
            await testValidDiscountWithModifiers(
              {
                type: DiscountTypeEnum.PERCENT,
                value: 3,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 4,
                },
              },
              // 590 490 610 _ 450
              [1, 2, 0, 0, 1],
              (discount, [p1, p2, _, __, p5]) =>
                ((p1.final_cost + p2.final_cost + p5.final_cost) *
                  discount.value) /
                100
            );
            await testValidDiscountWithOnlyModifiers(
              {
                type: DiscountTypeEnum.PERCENT,
                value: 3,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 4,
                },
              },
              // 590 490 _ _ 450
              [1, 2, 0, 0, 1],
              (discount, [p1, p2, _, __, p5]) =>
                ((p1.final_cost + p2.final_cost + p5.final_cost) *
                  discount.value) /
                100
            );
          });

          it("should provide a in cash discount for a special product", async () => {
            await testValidDiscountWithProductCategories(
              {
                type: DiscountTypeEnum.IN_CASH,
                value: 200,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              // 590 490 610
              [1, 2, 0, 0],
              discount => discount.value
            );
          });

          it("should provide a fixed price discount for a special product", async () => {
            await testValidDiscountWithProductCategories(
              {
                type: DiscountTypeEnum.FIXED_PRICE,
                value: 1000,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              // 590 490 610
              [1, 2, 0, 0],
              (discount, [product1, product2]) =>
                product1.final_cost + product2.final_cost - discount.value
            );
          });
        });

        describe("[not strict comparison]", () => {
          it("should provide a percent discount for a special product", async () => {
            await testValidDiscountWithProductCategories(
              {
                type: DiscountTypeEnum.PERCENT,
                value: 3,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              // 590 490 610
              [2, 3, 2, 1],
              (discount, [product1, product2, product3]) =>
                (product2.full_price * 3 * discount.value) / 100 +
                ((product1.full_price * 2 + product3.full_price * 1) *
                  discount.value) /
                  100
            );
          });

          it("should provide a in cash discount for a special product", async () => {
            await testValidDiscountWithProductCategories(
              {
                type: DiscountTypeEnum.IN_CASH,
                value: 220,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              // 590 490 610
              [2, 3, 2, 1],
              discount => discount.value * 2
            );
          });

          it("should provide a fixed price discount for a special product", async () => {
            await testValidDiscountWithProductCategories(
              {
                type: DiscountTypeEnum.FIXED_PRICE,
                value: 1000,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              // 590 490 610
              [2, 3, 2, 1],
              (discount, [product1, product2, product3]) =>
                product2.full_price * 3 -
                discount.value +
                (product1.full_price * 2 +
                  product3.full_price * 1 -
                  discount.value)
            );
          });
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.GREATER}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscountWithProductCategories(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.GREATER,
                value: 5,
              },
            },
            // 590 490 610
            [2, 1, 3, 2],
            (discount, [p1, p2, p3]) =>
              ((p2.final_cost + p1.final_cost + p3.final_cost) *
                discount.value) /
              100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testValidDiscountWithProductCategories(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.GREATER,
                value: 5,
              },
            },
            // 590 490 610
            [2, 1, 3, 2],
            discount => discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.GREATER,
                value: 5,
              },
            },
            // 590 490 610
            [2, 1, 3, 2]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.LESS}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscountWithProductCategories(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.LESS,
                value: 10,
              },
            },
            [2, 1, 3, 2],
            (discount, [p1, p2, p3]) =>
              ((p2.final_cost + p1.final_cost + p3.final_cost) *
                discount.value) /
              100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testValidDiscountWithProductCategories(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.LESS,
                value: 10,
              },
            },
            // 590 490 610
            [2, 1, 3, 2],
            discount => discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.LESS,
                value: 10,
              },
            },
            // 590 490 610
            [2, 1, 3, 2]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.BETWEEN}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscountWithProductCategories(
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
            // 590 490 610
            [2, 1, 3, 2],
            (discount, [p1, p2, p3]) =>
              ((p2.final_cost + p1.final_cost + p3.final_cost) *
                discount.value) /
              100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testValidDiscountWithProductCategories(
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
            // 590 490 610
            [2, 1, 3, 2],
            discount => discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.BETWEEN,
                value: 5,
                value2: 12,
              },
            },
            // 590 490 610
            [2, 1, 3, 2]
          );
        });
      });
    });

    describe(`[CRITERIA: ${DiscountCriteriaEnum.PRICE}] ...`, () => {
      describe(`[OP: ${DiscountOperatorEnum.EQUAL}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscountWithProductCategories(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.EQUAL,
                value: 3260, /// final products cost
              },
            },
            // 590 490 610
            [2, 3, 1, 2],
            (discount, [p1, p2, p3]) =>
              ((p2.final_cost + p1.final_cost + p3.final_cost) *
                discount.value) /
              100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testValidDiscountWithProductCategories(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.EQUAL,
                value: 3260, /// final products cost
              },
            },
            // 590 490 610
            [2, 3, 1, 2],
            discount => discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.EQUAL,
                value: 3260, /// final products cost
              },
            },
            // 590 490 610
            [2, 3, 1, 2]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.GREATER}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscountWithProductCategories(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.GREATER,
                value: 1000,
              },
            },
            // 590 490 610
            [2, 3, 1, 2],
            (discount, [p1, p2, p3]) =>
              ((p2.final_cost + p1.final_cost + p3.final_cost) *
                discount.value) /
              100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testValidDiscountWithProductCategories(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.GREATER,
                value: 1000,
              },
            },
            // 590 490 610
            [2, 3, 1, 2],
            discount => discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.GREATER,
                value: 1000,
              },
            },
            // 590 490 610
            [2, 3, 1, 2]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.LESS}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscountWithProductCategories(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.LESS,
                value: 5000,
              },
            },
            // 590 490 610
            [2, 3, 1, 2],
            (discount, [p1, p2, p3]) =>
              ((p2.final_cost + p1.final_cost + p3.final_cost) *
                discount.value) /
              100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testValidDiscountWithProductCategories(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.LESS,
                value: 5000,
              },
            },
            // 590 490 610
            [2, 3, 1, 2],
            discount => discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.LESS,
                value: 5000,
              },
            },
            // 590 490 610
            [2, 3, 1, 2]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.BETWEEN}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscountWithProductCategories(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.BETWEEN,
                value: 1000,
                value2: 5000,
              },
            },
            // 590 490 610
            [2, 3, 1, 2],
            (discount, [p1, p2, p3]) =>
              ((p2.final_cost + p1.final_cost + p3.final_cost) *
                discount.value) /
              100
          );
        });

        it("should provide a in cash discount for a special product (Invalid discount)", async () => {
          await testValidDiscountWithProductCategories(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.BETWEEN,
                value: 1000,
                value2: 5000,
              },
            },
            // 590 490 610
            [2, 3, 1, 2],
            discount => discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.BETWEEN,
                value: 1000,
                value2: 5000,
              },
            },
            // 590 490 610
            [2, 3, 1, 2]
          );
        });
      });
    });
  });
});
