import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
  IDiscount,
} from "../../interfaces";
import { IOrderedProduct } from "./get-suitable-discount";

export const getFinalDiscountValue = (options: {
  products: IOrderedProduct[];
  discount: IDiscount;
  conditionValue: number;
  totalCost: number;
}): number => {
  const { products, discount, conditionValue, totalCost } = options;
  let finalDiscount = 0;

  switch (discount.type) {
    case DiscountTypeEnum.PERCENT: {
      let localDiscount = 0;
      let localCheckValue = conditionValue;

      if (discount.scope === DiscountScopeEnum.GLOBAL) {
        finalDiscount = (totalCost * discount.value) / 100;
        break;
      }

      if (
        discount.condition.op === DiscountOperatorEnum.EQUAL &&
        discount.condition.criteria === DiscountCriteriaEnum.COUNT
      ) {
        let currentProductCount = 0;
        for (const product of products) {
          let availableProductCount = product.count;

          do {
            const productCount = Math.min(
              availableProductCount,
              discount.condition.value - currentProductCount
            );

            availableProductCount -= productCount;
            currentProductCount += productCount;
            localDiscount += product.fullPrice * productCount;
            localCheckValue -= productCount;

            if (currentProductCount < discount.condition.value) break;
            else {
              finalDiscount += (localDiscount * discount.value) / 100;
              localDiscount = 0;
              currentProductCount = 0;
            }
          } while (
            localCheckValue >= discount.condition.value &&
            availableProductCount
          );
        }
      } else {
        finalDiscount =
          (products.reduce(
            (totalPrice, p) => totalPrice + p.fullPrice * p.count,
            0
          ) *
            discount.value) /
          100;
      }
      break;
    }
    case DiscountTypeEnum.IN_CASH: {
      if (
        discount.scope === DiscountScopeEnum.GLOBAL ||
        discount.condition.criteria === DiscountCriteriaEnum.PRICE
      ) {
        finalDiscount = discount.value;
        break;
      }

      const diff = Math.floor(conditionValue / discount.condition.value) || 1;
      finalDiscount = diff * discount.value;

      break;
    }
    case DiscountTypeEnum.FIXED_PRICE: {
      let localDiscount = 0;
      let localCheckValue = conditionValue;

      if (
        discount.scope === DiscountScopeEnum.GLOBAL ||
        discount.condition.criteria !== DiscountCriteriaEnum.COUNT ||
        discount.condition.op !== DiscountOperatorEnum.EQUAL
      )
        throw new Error(`The invalid discount`);

      let currentProductCount = 0;
      for (const product of products) {
        let availableProductCount = product.count;

        do {
          const productCount = Math.min(
            availableProductCount,
            discount.condition.value - currentProductCount
          );

          availableProductCount -= productCount;
          currentProductCount += productCount;
          localDiscount += product.fullPrice * productCount;
          localCheckValue -= productCount;

          if (currentProductCount < discount.condition.value) break;
          else {
            finalDiscount += localDiscount - discount.value;
            localDiscount = 0;
            currentProductCount = 0;
          }
        } while (
          localCheckValue >= discount.condition.value &&
          availableProductCount
        );
      }
      break;
    }
  }

  return finalDiscount;
};

export default getFinalDiscountValue;
