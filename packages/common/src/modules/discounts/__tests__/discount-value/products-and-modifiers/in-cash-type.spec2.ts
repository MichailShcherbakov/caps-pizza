import { computeProductsCost } from "../../../compute-product-cost.helper";
import getConditionValue from "../../../get-condition-value";
import getDiscountValue from "../../../get-discount-value";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
  IDiscount,
} from "../../../../../interfaces";
import createDiscount from "../../helpers/create-discount.helper";
import createProduct from "../../helpers/create-product.helper";

describe("[Discount Module] ...", () => {
  describe("[Scope] [Products + Modifiers] ...", () => {
    describe("[Discount type] [In cash] ...", () => {
      describe("[Discount condition criteria] [Count] ...", () => {
        it("should return a discount value (one coincidence)", () => {
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 1,
            }),
            createProduct({
              fullPrice: 120,
              count: 1,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.IN_CASH,
            value: 100,
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
          ).toEqual(discount.value);
        });

        it("should return a suitable discount (nth coincidence (three))", () => {
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 3,
            }),
            createProduct({
              fullPrice: 120,
              count: 3,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.IN_CASH,
            value: 100,
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
          ).toEqual(discount.value * 3);
        });
      });

      describe("[Discount condition criteria] [Price] ...", () => {
        it("should return a suitable discount (one coincidence)", () => {
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 1,
            }),
            createProduct({
              fullPrice: 120,
              count: 1,
            }),
          ];
          const suitableProductsCost = computeProductsCost(suitableProducts);
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.IN_CASH,
            value: 100,
            condition: {
              criteria: DiscountCriteriaEnum.PRICE,
              op: DiscountOperatorEnum.EQUAL,
              value: suitableProductsCost,
            },
            products: suitableProducts.map(p => ({
              product_uuid: p.uuid,
              product: p,
              modifiers: [],
            })),
          });
          const conditionValue = getConditionValue(discount, suitableProducts);

          expect(
            getDiscountValue(
              discount,
              suitableProducts,
              conditionValue,
              suitableProductsCost
            )
          ).toEqual(discount.value);
        });

        it("should return a suitable discount (nth coincidence (three)) with count", () => {
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 3,
            }),
            createProduct({
              fullPrice: 120,
              count: 3,
            }),
          ];
          const suitableProductsCost = computeProductsCost(suitableProducts);
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.IN_CASH,
            value: 100,
            condition: {
              criteria: DiscountCriteriaEnum.PRICE,
              op: DiscountOperatorEnum.EQUAL,
              value: suitableProductsCost,
            },
            products: suitableProducts.map(p => ({
              product_uuid: p.uuid,
              product: p,
              modifiers: [],
            })),
          });
          const conditionValue = getConditionValue(discount, suitableProducts);

          expect(
            getDiscountValue(
              discount,
              suitableProducts,
              conditionValue,
              suitableProductsCost
            )
          ).toEqual(discount.value);
        });

        it("should return a suitable discount (nth coincidence (three)) without count", () => {
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 3,
            }),
            createProduct({
              fullPrice: 120,
              count: 3,
            }),
          ];
          const suitableProductsCost = computeProductsCost(suitableProducts, {
            withCount: false,
          });
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.IN_CASH,
            value: 100,
            condition: {
              criteria: DiscountCriteriaEnum.PRICE,
              op: DiscountOperatorEnum.EQUAL,
              value: suitableProductsCost,
            },
            products: suitableProducts.map(p => ({
              product_uuid: p.uuid,
              product: p,
              modifiers: [],
            })),
          });
          const conditionValue = getConditionValue(discount, suitableProducts);

          expect(
            getDiscountValue(
              discount,
              suitableProducts,
              conditionValue,
              suitableProductsCost
            )
          ).toEqual(discount.value * 3);
        });
      });
    });
  });
});
