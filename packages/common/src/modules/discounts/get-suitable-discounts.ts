import { IDiscount, IProductWithFullPrice } from "../../interfaces";
import { computeProductsCost } from "./compute-product-cost.helper";
import getConditionValue from "./get-condition-value";
import getDiscountValue from "./get-discount-value";
import getSuitableProducts from "./get-suitable-products";
import isFulfilledCondition from "./is-fulfilled-condition";
import orderByProfitable from "./order-by-profitable";

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
  const totalProductsCost = computeProductsCost(products);

  for (const discount of discounts) {
    const suitableProducts = getSuitableProducts(discount, products);

    const conditionValue = getConditionValue(discount, suitableProducts);

    if (!isFulfilledCondition(discount, conditionValue)) continue;

    const discountValue = getDiscountValue(
      discount,
      suitableProducts,
      conditionValue,
      totalProductsCost
    );

    suitableDiscounts.push({
      discount,
      discountValue,
      products: suitableProducts,
    });
  }

  suitableDiscounts = orderByProfitable(suitableDiscounts);

  /// TODO: crossing check

  return suitableDiscounts;
}

export default getSuitableDiscounts;
