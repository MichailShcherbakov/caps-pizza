import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
} from "~/db/entities/discount.entity";
import { testInvalidDiscount, testValidDiscount } from "./templates";

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
            await testValidDiscount(
              {
                type: DiscountTypeEnum.PERCENT,
                value: 3,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              [1, 0, 1, 1],
              (discount, _, totalOrderCost) =>
                (totalOrderCost * discount.value) / 100
            );
          });

          it("should provide a in cash discount for a special product", async () => {
            await testValidDiscount(
              {
                type: DiscountTypeEnum.IN_CASH,
                value: 220,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 5,
                },
              },
              [1, 2, 1, 1],
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
                  op: DiscountOperatorEnum.EQUAL,
                  value: 5,
                },
              },
              [1, 2, 1, 1]
            );
          });
        });

        describe("[not strict comparison]", () => {
          it("should provide a percent discount for a special product", async () => {
            await testValidDiscount(
              {
                type: DiscountTypeEnum.PERCENT,
                value: 3,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 5,
                },
              },
              [5, 3, 2, 1],
              () => 0
            );
          });

          it("should provide a in cash discount for a special product", async () => {
            await testValidDiscount(
              {
                type: DiscountTypeEnum.IN_CASH,
                value: 220,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 5,
                },
              },
              [5, 3, 2, 1],
              () => 0
            );
          });

          it("should provide a fixed price discount for a special product", async () => {
            await testInvalidDiscount(
              {
                type: DiscountTypeEnum.FIXED_PRICE,
                value: 1000,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 4,
                },
              },
              [1, 1, 1, 1]
            );
          });
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.GREATER}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscount(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.GREATER,
                value: 5,
              },
            },
            [1, 2, 3, 2],
            (discount, _, totalOrderCost) =>
              (totalOrderCost * discount.value) / 100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testValidDiscount(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.GREATER,
                value: 5,
              },
            },
            [1, 2, 3, 2],
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
            [1, 2, 3, 2]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.LESS}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscount(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.LESS,
                value: 10,
              },
            },
            [1, 2, 3, 2],
            (discount, _, totalOrderCost) =>
              (totalOrderCost * discount.value) / 100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testValidDiscount(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.LESS,
                value: 10,
              },
            },
            [1, 2, 3, 2],
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
            [1, 2, 3, 2]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.BETWEEN}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscount(
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
            [1, 2, 3, 2],
            (discount, _, totalOrderCost) =>
              (totalOrderCost * discount.value) / 100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testValidDiscount(
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
            [1, 2, 3, 2],
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
                value2: 10,
              },
            },
            [1, 2, 3, 2]
          );
        });
      });
    });

    describe(`[CRITERIA: ${DiscountCriteriaEnum.PRICE}] ...`, () => {
      describe(`[OP: ${DiscountOperatorEnum.EQUAL}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscount(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.EQUAL,
                value: 1180, // total order cost
              },
            },
            [2, 0, 0, 0],
            (discount, _, totalOrderCost) =>
              (totalOrderCost * discount.value) / 100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testValidDiscount(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.EQUAL,
                value: 1180, // total order cost
              },
            },
            [2, 0, 0, 0],
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
                value: 1180, // total order cost
              },
            },
            [2, 0, 0, 0]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.GREATER}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscount(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.GREATER,
                value: 1000,
              },
            },
            [2, 4, 1, 1],
            (discount, _, totalOrderCost) =>
              (totalOrderCost * discount.value) / 100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testValidDiscount(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.GREATER,
                value: 1000,
              },
            },
            [2, 4, 1, 1],
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
            [2, 4, 1, 1]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.LESS}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscount(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.LESS,
                value: 10000,
              },
            },
            [2, 4, 1, 1],
            (discount, _, totalOrderCost) =>
              (totalOrderCost * discount.value) / 100
          );
          await testValidDiscount(
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.LESS,
                value: 5,
              },
            },
            [2, 4, 1, 1],
            () => 0
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testValidDiscount(
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.LESS,
                value: 10000,
              },
            },
            [2, 4, 1, 1],
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
                value: 10000,
              },
            },
            [2, 4, 1, 1]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.BETWEEN}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscount(
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
            [2, 4, 1, 1],
            (discount, _, totalOrderCost) =>
              (totalOrderCost * discount.value) / 100
          );
        });

        it("should provide a in cash discount for a special product (Invalid discount)", async () => {
          await testValidDiscount(
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
            [2, 4, 1, 1],
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
                value: 0,
                value2: 5000,
              },
            },
            [2, 4, 1, 1]
          );
        });
      });
    });
  });
});
