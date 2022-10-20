import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
  IDiscount,
} from "../../../../../interfaces";
import createDiscount from "../../helpers/create-discount.helper";
import createProduct from "../../helpers/create-product.helper";
import { createProductCategory } from "../../helpers/create-product-category.helper";
import getSuitableDiscounts from "../../../get-suitable-discounts";
import orderProductsByProfitable from "../../../order-produts-by-profitable";

describe("[Discount Module] ...", () => {
  describe("[Scope] [Product Categories + Modifiers] ...", () => {
    describe("[Discount type] [In Cash] ...", () => {
      describe("[Discount condition criteria] [Count] ...", () => {
        it("should return a discount (one product)", () => {
          const productCategory = createProductCategory();
          const products = [
            createProduct({
              price: 440,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.IN_CASH,
            value: 200,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
                products: [],
                product_categories: [productCategory],
                modifiers: [],
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
              ]
            )
          ).toEqual([
            {
              discount,
              discountValue: discount.value,
              products: [
                {
                  ...products[0],
                  fullPrice: 440,
                  count: 3,
                },
              ],
            },
          ]);
        });

        it("should return a discount (two products)", () => {
          const productCategory = createProductCategory();
          const products = [
            createProduct({
              price: 440,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
            createProduct({
              price: 520,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.IN_CASH,
            value: 200,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
                products: [],
                product_categories: [productCategory],
                modifiers: [],
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
                  count: 1,
                },
              ]
            )
          ).toEqual([
            {
              discount,
              discountValue: discount.value,
              products: orderProductsByProfitable([
                {
                  ...products[1],
                  fullPrice: 520,
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

        it("should return a discount (three products)", () => {
          const productCategory = createProductCategory();
          const products = [
            createProduct({
              price: 440,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
            createProduct({
              price: 520,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
            createProduct({
              price: 560,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.IN_CASH,
            value: 200,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
                products: [],
                product_categories: [productCategory],
                modifiers: [],
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
              discountValue: discount.value,
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

        it("should return a discount (one product x2)", () => {
          const productCategory = createProductCategory();
          const products = [
            createProduct({
              price: 440,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.IN_CASH,
            value: 200,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
                products: [],
                product_categories: [productCategory],
                modifiers: [],
              },
            ],
          });
          expect(
            getSuitableDiscounts(
              [discount],
              [
                {
                  ...products[0],
                  count: 6,
                },
              ]
            )
          ).toEqual([
            {
              discount,
              discountValue: discount.value * 2,
              products: [
                {
                  ...products[0],
                  fullPrice: 440,
                  count: 6,
                },
              ],
            },
          ]);
        });

        it("should return a discount (two products x2)", () => {
          const productCategory = createProductCategory();
          const products = [
            createProduct({
              price: 440,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
            createProduct({
              price: 520,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.IN_CASH,
            value: 200,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
                products: [],
                product_categories: [productCategory],
                modifiers: [],
              },
            ],
          });
          expect(
            getSuitableDiscounts(
              [discount],
              [
                {
                  ...products[1],
                  count: 4,
                },
                {
                  ...products[0],
                  count: 2,
                },
              ]
            )
          ).toEqual([
            {
              discount,
              discountValue: discount.value * 2,
              products: orderProductsByProfitable([
                {
                  ...products[1],
                  fullPrice: 520,
                  count: 4,
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

        it("should return a discount (three products x3)", () => {
          const productCategory = createProductCategory();
          const products = [
            createProduct({
              price: 440,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
            createProduct({
              price: 520,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
            createProduct({
              price: 560,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.IN_CASH,
            value: 200,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
                products: [],
                product_categories: [productCategory],
                modifiers: [],
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
                  count: 3,
                },
                {
                  ...products[2],
                  count: 4,
                },
              ]
            )
          ).toEqual([
            {
              discount,
              discountValue: discount.value * 3,
              products: orderProductsByProfitable([
                {
                  ...products[2],
                  fullPrice: 560,
                  count: 4,
                },
                {
                  ...products[1],
                  fullPrice: 520,
                  count: 3,
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

        it("should return a discount (two products). It should choose the most expensive products", () => {
          const productCategory = createProductCategory();
          const products = [
            createProduct({
              price: 440,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
            createProduct({
              price: 520,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.IN_CASH,
            value: 200,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
                products: [],
                product_categories: [productCategory],
                modifiers: [],
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
          ).toEqual([
            {
              discount,
              discountValue: discount.value,
              products: orderProductsByProfitable([
                {
                  ...products[1],
                  fullPrice: 520,
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

        it("should return a discount (two products x2). It should choose the most expensive products", () => {
          const productCategory = createProductCategory();
          const products = [
            createProduct({
              price: 440,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
            createProduct({
              price: 520,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.IN_CASH,
            value: 200,
            strategies: [
              {
                condition: {
                  criteria: DiscountCriteriaEnum.COUNT,
                  op: DiscountOperatorEnum.EQUAL,
                  value: 3,
                },
                products: [],
                product_categories: [productCategory],
                modifiers: [],
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
                  count: 4,
                },
              ]
            )
          ).toEqual([
            {
              discount,
              discountValue: discount.value * 2,
              products: orderProductsByProfitable([
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
      });
    });
  });
});
