import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
  IDiscount,
} from "../../../../../interfaces";
import createDiscount from "../../helpers/create-discount.helper";
import createProduct from "../../helpers/create-product.helper";
import getSuitableDiscounts from "../../../get-suitable-discounts";

describe("[Discount Module] ...", () => {
  describe("[Scope] [Products + Modifiers] ...", () => {
    describe("[Discount type] [Percent] ...", () => {
      describe("[Discount condition criteria] [Count] ...", () => {
        it("should return a discount (full coincidence)", () => {
          const products = [createProduct(), createProduct(), createProduct()];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.PERCENT,
            value: 3,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 2,
                },
                products: [products[0], products[1]],
                modifiers: [],
                product_categories: [],
              },
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 1,
                },
                products: [products[2]],
                modifiers: [],
                product_categories: [],
              },
            ],
          });
          expect(
            getSuitableDiscounts(
              [discount],
              [
                {
                  ...products[0],
                  fullPrice: 440,
                  count: 1,
                },
                {
                  ...products[1],
                  fullPrice: 560,
                  count: 1,
                },
                {
                  ...products[2],
                  fullPrice: 120,
                  count: 1,
                },
              ]
            )
          ).toEqual([
            {
              discount,
              discountValue:
                (440 * 1 + 560 * 1 + 120 * 1) * (discount.value / 100),
              products: [
                {
                  ...products[1],
                  fullPrice: 560,
                  count: 1,
                },
                {
                  ...products[0],
                  fullPrice: 440,
                  count: 1,
                },
                {
                  ...products[2],
                  fullPrice: 120,
                  count: 1,
                },
              ],
            },
          ]);
        });

        it("should return a discount (more one coincidence)", () => {
          const products = [createProduct(), createProduct(), createProduct()];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.PERCENT,
            value: 3,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 2,
                },
                products: [products[0], products[1]],
                modifiers: [],
                product_categories: [],
              },
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 1,
                },
                products: [products[2]],
                modifiers: [],
                product_categories: [],
              },
            ],
          });
          expect(
            getSuitableDiscounts(
              [discount],
              [
                {
                  ...products[0],
                  fullPrice: 440,
                  count: 3,
                },
                {
                  ...products[1],
                  fullPrice: 560,
                  count: 1,
                },
                {
                  ...products[2],
                  fullPrice: 120,
                  count: 2,
                },
              ]
            )
          ).toEqual([
            {
              discount,
              discountValue:
                ((440 * 1 + 560 * 1 + 120 * 1) * discount.value) / 100,
              products: [
                {
                  ...products[1],
                  fullPrice: 560,
                  count: 1,
                },
                {
                  ...products[0],
                  fullPrice: 440,
                  count: 1,
                },
                {
                  ...products[2],
                  fullPrice: 120,
                  count: 1,
                },
              ],
            },
          ]);
        });

        it("should return a discount (cross coincidence)", () => {
          const products = [createProduct(), createProduct(), createProduct()];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.PERCENT,
            value: 3,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 2,
                },
                products: [products[0], products[1]],
                modifiers: [],
                product_categories: [],
              },
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 1,
                },
                products: [products[1]],
                modifiers: [],
                product_categories: [],
              },
            ],
          });
          expect(
            getSuitableDiscounts(
              [discount],
              [
                {
                  ...products[0],
                  fullPrice: 440,
                  count: 1,
                },
                {
                  ...products[1],
                  fullPrice: 560,
                  count: 2,
                },
              ]
            )
          ).toEqual([
            {
              discount,
              discountValue: ((440 * 1 + 560 * 2) * discount.value) / 100,
              products: [
                {
                  ...products[1],
                  fullPrice: 560,
                  count: 2,
                },
                {
                  ...products[0],
                  fullPrice: 440,
                  count: 1,
                },
              ],
            },
          ]);
        });

        it("should not return a discount (one non-coincidence)", () => {
          const products = [createProduct(), createProduct(), createProduct()];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.PERCENT,
            value: 3,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 2,
                },
                products: [products[0], products[1]],
                modifiers: [],
                product_categories: [],
              },
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 1,
                },
                products: [products[2]],
                modifiers: [],
                product_categories: [],
              },
            ],
          });
          expect(
            getSuitableDiscounts(
              [discount],
              [
                {
                  ...products[1],
                  fullPrice: 560,
                  count: 2,
                },
                {
                  ...products[2],
                  fullPrice: 120,
                  count: 2,
                },
              ]
            )
          ).toEqual([]);
        });

        it("should not return a discount (one non-coincidence)", () => {
          const products = [createProduct(), createProduct(), createProduct()];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.PERCENT,
            value: 3,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 2,
                },
                products: [products[0], products[1]],
                modifiers: [],
                product_categories: [],
              },
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 1,
                },
                products: [products[2]],
                modifiers: [],
                product_categories: [],
              },
            ],
          });
          expect(
            getSuitableDiscounts(
              [discount],
              [
                {
                  ...products[0],
                  fullPrice: 440,
                  count: 2,
                },
                {
                  ...products[1],
                  fullPrice: 560,
                  count: 2,
                },
              ]
            )
          ).toEqual([]);
        });
      });

      it("should not return a discount (cross coincidence)", () => {
        const products = [createProduct(), createProduct(), createProduct()];
        const discount: IDiscount = createDiscount({
          type: DiscountTypeEnum.PERCENT,
          value: 3,
          strategies: [
            {
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.EQUAL,
                value: 2,
              },
              products: [products[0], products[1]],
              modifiers: [],
              product_categories: [],
            },
            {
              condition: {
                criteria: DiscountCriteriaEnum.COUNT,
                op: DiscountOperatorEnum.EQUAL,
                value: 1,
              },
              products: [products[1]],
              modifiers: [],
              product_categories: [],
            },
          ],
        });
        expect(
          getSuitableDiscounts(
            [discount],
            [
              {
                ...products[0],
                fullPrice: 440,
                count: 1,
              },
              {
                ...products[1],
                fullPrice: 560,
                count: 1,
              },
            ]
          )
        ).toEqual([]);
      });
    });
  });
});
