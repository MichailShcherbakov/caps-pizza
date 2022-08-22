import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
  IDiscount,
  IModifier,
  IProductCategory,
} from "../../../interfaces";
import calculateDiscount from "../calculate-discount-value";
import { IOrderedProduct } from "../get-suitable-discount";
import createDiscount from "./helpers/create-discount.helper";
import createModifier from "./helpers/create-modifier.helper";
import { createProductCategory } from "./helpers/create-product-category.helper";
import createProduct from "./helpers/create-product.helper";

describe("[Discount Module] ...", () => {
  describe("should correct calculate a discount", () => {
    it("one product fulfill condition", () => {
      const orderCost = 440 * 3;
      const discountValue = 1199;
      const products: IOrderedProduct[] = [
        createProduct({
          fullPrice: 440,
          count: 3,
        }),
      ];
      const discounts: IDiscount[] = [
        createDiscount({
          type: DiscountTypeEnum.FIXED_PRICE,
          value: discountValue,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.EQUAL,
            value: 3,
          },
        }),
      ];

      const discount = calculateDiscount({
        products,
        discounts,
      });

      expect(discount).toEqual(orderCost - discountValue);
    });

    it("two product fulfill condition", () => {
      const orderCost = 440 * 3 + 540 * 2;
      const discountValue = 1199;
      const products: IOrderedProduct[] = [
        createProduct({
          fullPrice: 440,
          count: 3,
        }),
        createProduct({
          fullPrice: 540,
          count: 2,
        }),
      ];
      const discounts: IDiscount[] = [
        createDiscount({
          type: DiscountTypeEnum.FIXED_PRICE,
          value: discountValue,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.EQUAL,
            value: 3,
          },
        }),
      ];

      const discount = calculateDiscount({
        products,
        discounts,
      });

      expect(discount).toEqual(orderCost - discountValue - 540 * 2);
    });

    it("two product fulfill condition, but 1 does not. Has equal product category", () => {
      const orderCostWithDiscount = 1199 + 500 * 1 + 560 * 2;
      const modifiers: IModifier[] = [
        createModifier({
          price: 0,
        }),
        createModifier({
          price: 0,
        }),
      ];
      const productCategory: IProductCategory = createProductCategory();
      const products: IOrderedProduct[] = [
        createProduct({
          fullPrice: 510,
          count: 3,
          modifiers: [modifiers[0]],
          category_uuid: productCategory.uuid,
          category: productCategory,
        }),
        createProduct({
          fullPrice: 500,
          count: 1,
          modifiers: [modifiers[0]],
          category_uuid: productCategory.uuid,
          category: productCategory,
        }),
        createProduct({
          fullPrice: 560,
          count: 2,
          modifiers: [modifiers[1]],
          category_uuid: productCategory.uuid,
          category: productCategory,
        }),
      ];
      const orderCost = products.reduce(
        (cost, product) => cost + product.fullPrice * product.count,
        0
      );
      const discounts: IDiscount[] = [
        createDiscount({
          type: DiscountTypeEnum.FIXED_PRICE,
          value: 1199,
          condition: {
            criteria: DiscountCriteriaEnum.COUNT,
            op: DiscountOperatorEnum.EQUAL,
            value: 3,
          },
          scope: DiscountScopeEnum.PRODUCT_FEATURES,
          modifiers: [modifiers[0]],
          product_categories: [productCategory],
        }),
      ];

      const discount = calculateDiscount({
        products,
        discounts,
      });

      expect(orderCost - discount).toEqual(orderCostWithDiscount);
    });
  });
});
