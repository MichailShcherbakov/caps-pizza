import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
  IDiscount,
} from "../../../../../interfaces";
import createDiscount from "../../helpers/create-discount.helper";
import createProduct from "../../helpers/create-product.helper";
import getSuitableDiscounts from "../../../get-suitable-discounts";
import orderProductsByProfitable from "../../../order-produts-by-profitable";

describe("[Discount Module] ...", () => {
  describe("[Scope] [Products + Modifiers] ...", () => {
    describe("[Discount type] [Fixed Price] ...", () => {
      describe("[Discount condition criteria] [Count] ...", () => {
        it("should return a discount (full coincidence)", () => {
          const products = [
            createProduct({
              price: 440,
            }),
            createProduct({
              price: 560,
            }),
            createProduct({
              price: 120,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 950,
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
                  count: 1,
                },
                {
                  ...products[1],
                  count: 1,
                },
                {
                  ...products[2],
                  count: 1,
                },
              ]
            )
          ).toEqual([
            {
              discount,
              discountValue: 440 * 1 + 560 * 1 + 120 * 1 - discount.value,
              products: [
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
              ],
            },
          ]);
        });

        it("should return a discount (full coincidence x2)", () => {
          const products = [
            createProduct({ price: 440 }),
            createProduct({ price: 560 }),
            createProduct({ price: 120 }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 950,
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
                  count: 2,
                },
                {
                  ...products[1],
                  count: 2,
                },
                {
                  ...products[2],
                  count: 2,
                },
              ]
            )
          ).toEqual([
            {
              discount,
              discountValue: (440 * 1 + 560 * 1 + 120 * 1 - discount.value) * 2,
              products: [
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
                {
                  ...products[2],
                  fullPrice: 120,
                  count: 2,
                },
              ],
            },
          ]);
        });

        it("should return a discount (more one coincidence)", () => {
          const products = [
            createProduct({ price: 440 }),
            createProduct({ price: 560 }),
            createProduct({ price: 120 }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 950,
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
                  count: 3,
                },
                {
                  ...products[1],
                  count: 1,
                },
                {
                  ...products[2],
                  count: 2,
                },
              ]
            )
          ).toEqual([
            {
              discount,
              discountValue: 440 * 1 + 560 * 1 + 120 * 1 - discount.value,
              products: [
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
              ],
            },
          ]);
        });

        it("should return a discount (cross coincidence)", () => {
          const products = [
            createProduct({ price: 440 }),
            createProduct({ price: 560 }),
            createProduct(),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 950,
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
                  count: 1,
                },
                {
                  ...products[1],
                  count: 2,
                },
              ]
            )
          ).toEqual([
            {
              discount,
              discountValue: 440 * 1 + 560 * 2 - discount.value,
              products: orderProductsByProfitable([
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
              ]),
            },
          ]);
        });

        it("should not return a discount (one non-coincidence)", () => {
          const products = [
            createProduct(),
            createProduct({ price: 560 }),
            createProduct({ price: 120 }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 950,
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
                  count: 2,
                },
                {
                  ...products[2],
                  count: 2,
                },
              ]
            )
          ).toEqual([]);
        });

        it("should not return a discount (one non-coincidence)", () => {
          const products = [
            createProduct({ price: 440 }),
            createProduct({ price: 560 }),
            createProduct(),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 950,
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
                  count: 2,
                },
                {
                  ...products[1],
                  count: 2,
                },
              ]
            )
          ).toEqual([]);
        });
      });

      it("should not return a discount (cross coincidence)", () => {
        const products = [
          createProduct({ price: 440 }),
          createProduct({ price: 560 }),
          createProduct(),
        ];
        const discount: IDiscount = createDiscount({
          type: DiscountTypeEnum.FIXED_PRICE,
          value: 950,
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
                count: 1,
              },
              {
                ...products[1],
                count: 1,
              },
            ]
          )
        ).toEqual([]);
      });

      it("should not return a discount (empty product list)", () => {
        const products = [createProduct(), createProduct(), createProduct()];
        const discount: IDiscount = createDiscount({
          type: DiscountTypeEnum.FIXED_PRICE,
          value: 950,
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
        expect(getSuitableDiscounts([discount], [])).toEqual([]);
      });
    });
  });
});
