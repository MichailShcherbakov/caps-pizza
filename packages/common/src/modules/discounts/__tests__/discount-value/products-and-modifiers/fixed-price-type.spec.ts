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

describe("[Discount Module] ...", () => {
  describe("[Scope] [Products + Modifiers] ...", () => {
    describe("[Discount type] [Fixed Price] ...", () => {
      describe("[Discount condition criteria] [Count] ...", () => {
        it("should return a discount value (one coincidence)", () => {
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 1,
            }),
            createProduct({
              fullPrice: 560,
              count: 1,
            }),
            createProduct({
              fullPrice: 510,
              count: 1,
            }),
            createProduct({
              fullPrice: 120,
              count: 1,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 1250,
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 1,
            },
            products: suitableProducts.map(p => ({
              product_uuid: p.uuid,
              product: p,
              modifiers: [],
            })),
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
          ).toEqual(suitableProductsCost - discount.value);
        });

        it("should return a suitable discount (nth coincidence (two))", () => {
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 2,
            }),
            createProduct({
              fullPrice: 560,
              count: 2,
            }),
            createProduct({
              fullPrice: 510,
              count: 2,
            }),
            createProduct({
              fullPrice: 120,
              count: 2,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 1250,
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 1,
            },
            products: suitableProducts.map(p => ({
              product_uuid: p.uuid,
              product: p,
              modifiers: [],
            })),
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
          ).toEqual((suitableProductsCost - discount.value) * 2);
        });

        it("should return a suitable discount (not full coincidence (1-2))", () => {
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 2,
            }),
            createProduct({
              fullPrice: 560,
              count: 1,
            }),
            createProduct({
              fullPrice: 510,
              count: 2,
            }),
            createProduct({
              fullPrice: 120,
              count: 1,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 1250,
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 1,
            },
            products: suitableProducts.map(p => ({
              product_uuid: p.uuid,
              product: p,
              modifiers: [],
            })),
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
          ).toEqual(suitableProductsCost - discount.value);
        });
      });
    });
  });
});
