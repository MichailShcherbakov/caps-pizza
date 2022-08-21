import { DiscountCriteriaEnum, IDiscount } from "../../interfaces";
import { IOrderedProduct } from "./calculate-discount";

export const getConditionValue = (
  discount: IDiscount,
  products: IOrderedProduct[]
): number => {
  if (discount.condition.criteria === DiscountCriteriaEnum.COUNT)
    return products.reduce((count, p) => count + p.count, 0);

  if (discount.condition.criteria === DiscountCriteriaEnum.PRICE)
    return products.reduce(
      (totalPrice, p) => totalPrice + p.fullPrice * p.count,
      0
    );

  return 0;
};

export default getConditionValue;
