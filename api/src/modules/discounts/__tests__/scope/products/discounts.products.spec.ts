import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
} from "~/db/entities/discount.entity";
import { UnitTestingModule } from "../../__mocks__/discounts.service";
import { testInvalidDiscount, testValidDiscount } from "./templates";

describe("[Unit] [Discounts Module] ... ", () => {
  let testingModule: UnitTestingModule;

  beforeAll(async () => {
    testingModule = new UnitTestingModule();
    await testingModule.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe(`[SCOPE: ${DiscountScopeEnum.PRODUCTS}] ... `, () => {
    describe(`[CRITERIA: ${DiscountCriteriaEnum.COUNT}] ... `, () => {
      describe(`[OP: ${DiscountOperatorEnum.EQUAL}] ... `, () => {
        describe("[strict comparison]", () => {
          it("should provide a percent discount for a special product", async () => {
            await testValidDiscount(
              testingModule,
              {
                type: DiscountTypeEnum.PERCENT,
                value: 3,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              // 590 610
              [1, 0, 2, 0],
              (discount, [p1, _, p3]) =>
                ((p1.final_cost + p3.final_cost) * discount.value) / 100
            );
          });

          it("should provide a in cash discount for a special product", async () => {
            await testValidDiscount(
              testingModule,
              {
                type: DiscountTypeEnum.IN_CASH,
                value: 220,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              // 590 610
              [1, 0, 2, 0],
              discount => discount.value
            );
          });

          it("should provide a fixed price discount for a special product", async () => {
            await testValidDiscount(
              testingModule,
              {
                type: DiscountTypeEnum.FIXED_PRICE,
                value: 1000,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              [1, 0, 2, 0],
              (discount, [p1, _, p3]) =>
                p1.final_cost + p3.final_cost - discount.value
            );
          });
        });

        describe("[not strict comparison]", () => {
          it("should provide a percent discount for a special product", async () => {
            await testValidDiscount(
              testingModule,
              {
                type: DiscountTypeEnum.PERCENT,
                value: 3,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              // 590 610
              [2, 2, 5, 5],
              (discount, [p1, _, p3]) =>
                ((p1.full_price * 2 + p3.full_price * 1) * discount.value) /
                  100 +
                (p3.full_price * 3 * discount.value) / 100
            );
          });

          it("should provide a in cash discount for a special product", async () => {
            await testValidDiscount(
              testingModule,
              {
                type: DiscountTypeEnum.IN_CASH,
                value: 220,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              // 590 610
              [2, 2, 5, 5],
              discount => discount.value * 2
            );
          });

          it("should provide a fixed price discount for a special product", async () => {
            await testValidDiscount(
              testingModule,
              {
                type: DiscountTypeEnum.FIXED_PRICE,
                value: 1000,
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
              },
              // 590 610
              [2, 2, 5, 5],
              (discount, [p1, _, p3]) =>
                p1.full_price * 2 +
                p3.full_price * 1 -
                discount.value +
                (p3.full_price * 3 - discount.value)
            );
          });
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.GREATER}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscount(
            testingModule,
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.GREATER,
                value: 5,
              },
            },
            // 590 610
            [2, 2, 5, 5],
            (discount, [p1, _, p3]) =>
              ((p1.final_cost + p3.final_cost) * discount.value) / 100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testValidDiscount(
            testingModule,
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.GREATER,
                value: 5,
              },
            },
            // 590 610
            [2, 2, 5, 5],
            discount => discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            testingModule,
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.GREATER,
                value: 5,
              },
            },
            // 590 610
            [2, 2, 5, 5]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.LESS}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscount(
            testingModule,
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.LESS,
                value: 10,
              },
            },
            // 590 610
            [2, 2, 5, 5],
            (discount, [p1, _, p3]) =>
              ((p1.final_cost + p3.final_cost) * discount.value) / 100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testValidDiscount(
            testingModule,
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.LESS,
                value: 10,
              },
            },
            // 590 610
            [2, 2, 5, 5],
            discount => discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            testingModule,
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.LESS,
                value: 10,
              },
            },
            // 590 610
            [2, 2, 5, 5]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.BETWEEN}]`, () => {
        it("should provide a percent discount for a special product", async () => {
          await testValidDiscount(
            testingModule,
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
            // 590 610
            [2, 2, 5, 5],
            (discount, [p1, _, p3]) =>
              ((p1.final_cost + p3.final_cost) * discount.value) / 100
          );
        });

        it("should provide a in cash discount for a special product", async () => {
          await testValidDiscount(
            testingModule,
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
            // 590 610
            [2, 2, 5, 5],
            discount => discount.value
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            testingModule,
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
            // 590 610
            [2, 2, 5, 5]
          );
        });
      });
    });

    describe(`[CRITERIA: ${DiscountCriteriaEnum.PRICE}] ...`, () => {
      describe(`[OP: ${DiscountOperatorEnum.EQUAL}]`, () => {
        it("should provide a percent discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            testingModule,
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.EQUAL,
                value: 220,
              },
            },
            [1, 7]
          );
        });

        it("should provide a in cash discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            testingModule,
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.EQUAL,
                value: 220,
              },
            },
            [1, 7]
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            testingModule,
            {
              type: DiscountTypeEnum.FIXED_PRICE,
              value: 1000,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.EQUAL,
                value: 220,
              },
            },
            [1, 7]
          );
        });
      });

      describe(`[OP: ${DiscountOperatorEnum.GREATER}]`, () => {
        it("should provide a percent discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            testingModule,
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.GREATER,
                value: 5,
              },
            },
            [1, 7]
          );
        });

        it("should provide a in cash discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            testingModule,
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.GREATER,
                value: 5,
              },
            },
            [1, 7]
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            testingModule,
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
        it("should provide a percent discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            testingModule,
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.LESS,
                value: 5,
              },
            },
            [1, 2]
          );
        });

        it("should provide a in cash discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            testingModule,
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.LESS,
                value: 5,
              },
            },
            [1, 3]
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            testingModule,
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
        it("should provide a percent discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            testingModule,
            {
              type: DiscountTypeEnum.PERCENT,
              value: 3,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.BETWEEN,
                value: 5,
                value2: 10,
              },
            },
            [1, 7]
          );
        });

        it("should provide a in cash discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            testingModule,
            {
              type: DiscountTypeEnum.IN_CASH,
              value: 220,
              condition: {
                criteria: DiscountCriteriaEnum.PRICE,
                op: DiscountOperatorEnum.BETWEEN,
                value: 5,
                value2: 10,
              },
            },
            [1, 6]
          );
        });

        it("should provide a fixed price discount for a special product (Invalid discount)", async () => {
          await testInvalidDiscount(
            testingModule,
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
