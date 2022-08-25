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
import createModifier from "../../helpers/create-modifier.helper";

describe("[Discount Module] ...", () => {
  describe("[Scope] [Modifiers] ...", () => {
    describe("[Discount type] [Fixed Price] ...", () => {
      describe("[Discount condition criteria] [Count] ...", () => {
        it("should return a discount value (one coincidence)", () => {
          const modifiers = [createModifier()];
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 1,
              modifiers,
            }),
            createProduct({
              fullPrice: 560,
              count: 1,
              modifiers,
            }),
            createProduct({
              fullPrice: 520,
              count: 1,
              modifiers,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 800,
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            modifiers,
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
          ).toEqual(440 * 1 + 560 * 1 + 520 * 1 - discount.value);
        });

        it("should return a suitable discount (nth coincidence (three))", () => {
          const modifiers = [createModifier()];
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 2,
              modifiers,
            }),
            createProduct({
              fullPrice: 560,
              count: 2,
              modifiers,
            }),
            createProduct({
              fullPrice: 520,
              count: 2,
              modifiers,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 1250,
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            modifiers,
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
          ).toEqual(suitableProductsCost - discount.value * 2);
        });

        it("should return a suitable discount (not full coincidence (other modifiers))", () => {
          const modifiers = [createModifier()];
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 2,
              modifiers: [createModifier(), ...modifiers],
            }),
            createProduct({
              fullPrice: 560,
              count: 2,
              modifiers,
            }),
            createProduct({
              fullPrice: 520,
              count: 2,
              modifiers: [...modifiers, createModifier()],
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 1250,
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            modifiers,
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
          ).toEqual(suitableProductsCost - discount.value * 2);
        });

        it("should return a suitable discount (not full coincidence (other modifiers))", () => {
          const modifiers = [createModifier()];
          const suitableProducts = [
            createProduct({
              fullPrice: 440,
              count: 2,
              modifiers: [createModifier(), ...modifiers],
            }),
            createProduct({
              fullPrice: 560,
              count: 1,
              modifiers,
            }),
          ];
          const discount: IDiscount = createDiscount({
            type: DiscountTypeEnum.FIXED_PRICE,
            value: 1250,
            condition: {
              criteria: DiscountCriteriaEnum.COUNT,
              op: DiscountOperatorEnum.EQUAL,
              value: 3,
            },
            modifiers,
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
