import {
  DiscountCriteriaEnum,
  DiscountTypeEnum,
  IDiscount,
  IProductWithFullPrice,
} from "../../interfaces";
import { computeProductsCost } from "./compute-product-cost.helper";
import getConditionValue from "./get-condition-value";
import getSuitableProducts from "./get-suitable-products";
import isFulfilledCondition from "./is-fulfilled-condition";
import orderDiscountsByProfitable from "./order-discounts-by-profitable";
import orderProductsByProfitable from "./order-produts-by-profitable";

export interface ISuitableDiscount {
  discount: IDiscount;
  products: IProductWithFullPrice[];
  discountValue: number;
}

export function getSuitableDiscounts(
  discounts: IDiscount[],
  products: IProductWithFullPrice[]
): ISuitableDiscount[] {
  let suitableDiscounts: ISuitableDiscount[] = [];
  let providedProducts = products;

  for (const discount of discounts) {
    let passed = true;
    let diff = 1;
    const allSuitableProducts = new Map<string, IProductWithFullPrice>();

    for (const strategy of discount.strategies) {
      const suitableProducts = orderProductsByProfitable(
        getSuitableProducts(strategy, providedProducts)
      );

      if (strategy.condition.criteria === DiscountCriteriaEnum.PRICE) {
        const conditionValue = getConditionValue(
          strategy.condition,
          suitableProducts
        );

        if (!isFulfilledCondition(strategy.condition, conditionValue)) {
          passed = false;
          break;
        }

        for (const suitableProduct of suitableProducts) {
          const existSuitableProduct = allSuitableProducts.get(
            suitableProduct.uuid
          );

          if (existSuitableProduct) {
            existSuitableProduct.count++;
          } else {
            allSuitableProducts.set(suitableProduct.uuid, {
              ...suitableProduct,
              count: 1,
            });
          }

          --suitableProduct.count;

          if (!suitableProduct.count) {
            providedProducts = providedProducts.filter(
              p => p.uuid !== suitableProduct.uuid
            );
          }
        }

        continue;
      }

      if (strategy.products.length) {
        if (suitableProducts.length !== strategy.products.length) {
          passed = false;
          break;
        }

        let availableProductCount = strategy.condition.value;
        while (availableProductCount > 0) {
          for (const suitableProduct of suitableProducts) {
            const existSuitableProduct = allSuitableProducts.get(
              suitableProduct.uuid
            );

            if (existSuitableProduct) {
              existSuitableProduct.count++;
            } else {
              allSuitableProducts.set(suitableProduct.uuid, {
                ...suitableProduct,
                count: 1,
              });
            }

            --suitableProduct.count;
            --availableProductCount;

            if (!suitableProduct.count) {
              providedProducts = providedProducts.filter(
                p => p.uuid !== suitableProduct.uuid
              );
            }
          }
        }
        continue;
      }

      diff = 0;

      let currentProductCount = 0;
      let currentConditionValue = getConditionValue(
        strategy.condition,
        suitableProducts
      );
      for (const suitableProduct of suitableProducts) {
        let availableProductCount = suitableProduct.count;

        do {
          const productCount = Math.min(
            availableProductCount,
            strategy.condition.value - currentProductCount
          );

          availableProductCount -= productCount;
          currentProductCount += productCount;
          currentConditionValue -= productCount;

          const existSuitableProduct = allSuitableProducts.get(
            suitableProduct.uuid
          );

          if (existSuitableProduct) {
            existSuitableProduct.count += productCount;
          } else {
            allSuitableProducts.set(suitableProduct.uuid, {
              ...suitableProduct,
              count: productCount,
            });
          }

          suitableProduct.count -= productCount;

          if (!suitableProduct.count) {
            providedProducts = providedProducts.filter(
              p => p.uuid !== suitableProduct.uuid
            );
          }

          if (currentProductCount === strategy.condition.value) {
            diff++;
            currentProductCount = 0;
          } else if (currentProductCount < strategy.condition.value) {
            break;
          }
        } while (
          currentConditionValue >= strategy.condition.value &&
          availableProductCount > 0
        );
      }
    }

    if (!passed) continue;

    const finalSuitableProducts = Array.from(allSuitableProducts).map(
      ([, product]) => product
    );

    let discountValue = 0;
    const suitableProductsCost = computeProductsCost(finalSuitableProducts);

    if (discount.type === DiscountTypeEnum.IN_CASH) {
      discountValue = diff * discount.value;
    } else if (discount.type === DiscountTypeEnum.PERCENT) {
      discountValue =
        (suitableProductsCost / diff) * (discount.value / 100) * diff;
    } else if (discount.type === DiscountTypeEnum.FIXED_PRICE) {
      discountValue = (suitableProductsCost / diff - discount.value) * diff;
    }

    suitableDiscounts.push({
      discount,
      discountValue,
      products: finalSuitableProducts,
    });
  }

  suitableDiscounts = orderDiscountsByProfitable(suitableDiscounts);

  /// TODO: crossing check

  return suitableDiscounts;
}

export default getSuitableDiscounts;
