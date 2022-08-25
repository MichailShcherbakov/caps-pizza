import getDiscountValue from "../../get-discount-value";
import { IDiscount, IProductWithFullPrice } from "../../../../interfaces";
import { computeProductsCost } from "../../compute-product-cost.helper";
import getConditionValue from "../../get-condition-value";

export default function discountTestTemplate(
  suitableProducts: IProductWithFullPrice[],
  discount: IDiscount,
  expectValue: number,
  options?: { withCount?: boolean }
) {
  const suitableProductsCost = computeProductsCost(suitableProducts, {
    withCount: options?.withCount ?? true,
  });
  const conditionValue = getConditionValue(discount, suitableProducts);

  expect(
    getDiscountValue(
      discount,
      suitableProducts,
      conditionValue,
      suitableProductsCost
    )
  ).toEqual(expectValue);
}
