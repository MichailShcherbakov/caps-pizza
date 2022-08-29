import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
  IDiscount,
} from "../../../../../interfaces";
import createDiscount from "../../helpers/create-discount.helper";
import createProduct from "../../helpers/create-product.helper";
import createModifier from "../../helpers/create-modifier.helper";
import getSuitableDiscounts from "../../../get-suitable-discounts";
import orderProductsByProfitable from "../../../order-produts-by-profitable";

describe("[Discount Module] ...", () => {
  describe("[Scope] [Modifiers] ...", () => {
    describe("[Discount type] [Fixed Price] ...", () => {
      describe("[Discount condition criteria] [Count] ...", () => {
        it("should return a discount (one coincidence)", () => {
          const modifiers = [createModifier()];
          const products = [
            createProduct({
              modifiers,
            }),
            createProduct({
              modifiers,
            }),
            createProduct({
              modifiers,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 800,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
                products: [],
                product_categories: [],
                modifiers,
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
                  fullPrice: 520,
                  count: 1,
                },
                {
                  ...products[2],
                  fullPrice: 560,
                  count: 1,
                },
              ]
            )
          ).toEqual([
            {
              discount,
              discountValue: 440 * 1 + 560 * 1 + 520 * 1 - discount.value,
              products: orderProductsByProfitable([
                {
                  ...products[2],
                  fullPrice: 560,
                  count: 1,
                },
                {
                  ...products[1],
                  fullPrice: 520,
                  count: 1,
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

        it("should return a suitable discount (nth coincidence (three))", () => {
          const modifiers = [createModifier()];
          const products = [
            createProduct({
              modifiers,
            }),
            createProduct({
              modifiers,
            }),
            createProduct({
              modifiers,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 1250,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
                products: [],
                product_categories: [],
                modifiers,
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
                  fullPrice: 520,
                  count: 3,
                },
                {
                  ...products[2],
                  fullPrice: 560,
                  count: 3,
                },
              ]
            )
          ).toEqual([
            {
              discount,
              discountValue: (440 * 1 + 560 * 1 + 520 * 1 - discount.value) * 3,
              products: orderProductsByProfitable([
                {
                  ...products[2],
                  fullPrice: 560,
                  count: 3,
                },
                {
                  ...products[1],
                  fullPrice: 520,
                  count: 3,
                },
                {
                  ...products[0],
                  fullPrice: 440,
                  count: 3,
                },
              ]),
            },
          ]);
        });

        it("should return a suitable discount (not full coincidence (other modifiers))", () => {
          const modifiers = [createModifier()];
          const products = [
            createProduct({
              modifiers: [createModifier(), ...modifiers],
            }),
            createProduct({
              modifiers,
            }),
            createProduct({
              modifiers: [...modifiers, createModifier()],
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 1250,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
                products: [],
                product_categories: [],
                modifiers,
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
                  fullPrice: 520,
                  count: 2,
                },
                {
                  ...products[2],
                  fullPrice: 560,
                  count: 2,
                },
              ]
            )
          ).toEqual([
            {
              discount,
              discountValue: (440 * 1 + 560 * 1 + 520 * 1 - discount.value) * 2,
              products: orderProductsByProfitable([
                {
                  ...products[2],
                  fullPrice: 560,
                  count: 2,
                },
                {
                  ...products[1],
                  fullPrice: 520,
                  count: 2,
                },
                {
                  ...products[0],
                  fullPrice: 440,
                  count: 2,
                },
              ]),
            },
          ]);
        });

        it("should return a suitable discount (not full coincidence (other modifiers))", () => {
          const modifiers = [createModifier()];
          const products = [
            createProduct({
              modifiers: [createModifier(), ...modifiers],
            }),
            createProduct({
              modifiers,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 1250,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
                products: [],
                product_categories: [],
                modifiers,
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
          ).toEqual([
            {
              discount,
              discountValue: 560 * 1 + 440 * 2 - discount.value,
              products: orderProductsByProfitable([
                {
                  ...products[1],
                  fullPrice: 560,
                  count: 1,
                },
                {
                  ...products[0],
                  fullPrice: 440,
                  count: 2,
                },
              ]),
            },
          ]);
        });
      });
    });
  });
});
