import { computeProductsCost } from "../../../compute-product-cost.helper";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
  IDiscount,
} from "../../../../../interfaces";
import createDiscount from "../../helpers/create-discount.helper";
import createProduct from "../../helpers/create-product.helper";
import getDiscountValue from "../../../get-discount-value";
import getConditionValue from "../../../get-condition-value";
import { createProductCategory } from "../../helpers/create-product-category.helper";

describe("[Discount Module] ...", () => {
  describe("[Scope] [Product Categories + Modifiers] ...", () => {
    describe("[Discount type] [Fixed Price] ...", () => {
      describe("[Discount condition criteria] [Count] ...", () => {
        it("should return a discount value (one product)", () => {
          const productCategory = createProductCategory();
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 3,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 1199,
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            product_categories: [
              {
                category_uuid: productCategory.uuid,
                category: productCategory,
                modifiers: [],
              },
            ],
          });
          const suitableProductsCost = computeProductsCost(suitableProducts);
          const conditionValue = getConditionValue(discount, suitableProducts);

          expect(
            getDiscountValue(
              discount,
              suitableProducts,
              conditionValue,
              suitableProductsCost
            )
          ).toEqual(440 * 3 - discount.value);
        });

        it("should return a suitable discount (two products)", () => {
          const productCategory = createProductCategory();
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 2,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
            createProduct({
              fullPrice: 560,
              count: 1,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 1199,
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            product_categories: [
              {
                category_uuid: productCategory.uuid,
                category: productCategory,
                modifiers: [],
              },
            ],
          });
          const suitableProductsCost = computeProductsCost(suitableProducts);
          const conditionValue = getConditionValue(discount, suitableProducts);

          expect(
            getDiscountValue(
              discount,
              suitableProducts,
              conditionValue,
              suitableProductsCost
            )
          ).toEqual(440 * 2 + 560 * 1 - discount.value);
        });

        it("should return a suitable discount (three products)", () => {
          const productCategory = createProductCategory();
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 1,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
            createProduct({
              fullPrice: 440,
              count: 1,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
            createProduct({
              fullPrice: 440,
              count: 1,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 1199,
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            product_categories: [
              {
                category_uuid: productCategory.uuid,
                category: productCategory,
                modifiers: [],
              },
            ],
          });
          const suitableProductsCost = computeProductsCost(suitableProducts);
          const conditionValue = getConditionValue(discount, suitableProducts);

          expect(
            getDiscountValue(
              discount,
              suitableProducts,
              conditionValue,
              suitableProductsCost
            )
          ).toEqual(440 * 3 - discount.value);
        });

        it("should return a discount value (one product x 2)", () => {
          const productCategory = createProductCategory();
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 6,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 1199,
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            product_categories: [
              {
                category_uuid: productCategory.uuid,
                category: productCategory,
                modifiers: [],
              },
            ],
          });
          const suitableProductsCost = computeProductsCost(suitableProducts);
          const conditionValue = getConditionValue(discount, suitableProducts);

          expect(
            getDiscountValue(
              discount,
              suitableProducts,
              conditionValue,
              suitableProductsCost
            )
          ).toEqual((440 * 3 - discount.value) * 2);
        });

        it("should return a suitable discount (two products x 2)", () => {
          const productCategory = createProductCategory();
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 2,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
            createProduct({
              fullPrice: 560,
              count: 4,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 1199,
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            product_categories: [
              {
                category_uuid: productCategory.uuid,
                category: productCategory,
                modifiers: [],
              },
            ],
          });
          const suitableProductsCost = computeProductsCost(suitableProducts);
          const conditionValue = getConditionValue(discount, suitableProducts);

          expect(
            getDiscountValue(
              discount,
              suitableProducts,
              conditionValue,
              suitableProductsCost
            )
          ).toEqual(560 * 4 + 440 * 2 - discount.value * 2);
        });

        it("should return a suitable discount (three products)", () => {
          const productCategory = createProductCategory();
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 4,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
            createProduct({
              fullPrice: 560,
              count: 1,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
            createProduct({
              fullPrice: 320,
              count: 1,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 1199,
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            product_categories: [
              {
                category_uuid: productCategory.uuid,
                category: productCategory,
                modifiers: [],
              },
            ],
          });
          const suitableProductsCost = computeProductsCost(suitableProducts);
          const conditionValue = getConditionValue(discount, suitableProducts);

          expect(
            getDiscountValue(
              discount,
              suitableProducts,
              conditionValue,
              suitableProductsCost
            )
          ).toEqual(440 * 4 + 560 * 1 + 320 * 1 - discount.value * 2);
        });

        it("should return a suitable discount (two products x2). It should choose the most expensive products", () => {
          const productCategory = createProductCategory();
          const suitableProducts = [
            createProduct({
              fullPrice: 560,
              count: 2,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
            createProduct({
              fullPrice: 440,
              count: 2,
              category_uuid: productCategory.uuid,
              category: productCategory,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 1199,
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            product_categories: [
              {
                category_uuid: productCategory.uuid,
                category: productCategory,
                modifiers: [],
              },
            ],
          });
          const suitableProductsCost = computeProductsCost(suitableProducts);
          const conditionValue = getConditionValue(discount, suitableProducts);

          expect(
            getDiscountValue(
              discount,
              suitableProducts,
              conditionValue,
              suitableProductsCost
            )
          ).toEqual(560 * 2 + 440 * 1 - discount.value);
        });
      });
    });
  });
});
