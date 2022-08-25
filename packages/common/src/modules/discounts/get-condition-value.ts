import {
  DiscountCriteriaEnum,
  IDiscount,
  IProductWithFullPrice,
} from "../../interfaces";

export const getConditionValue = (
  discount: IDiscount,
  products: IProductWithFullPrice[]
): number => {
  if (discount.condition.criteria === DiscountCriteriaEnum.COUNT)
    return Math.floor(products.reduce((count, p) => count + p.count, 0));

  if (discount.condition.criteria === DiscountCriteriaEnum.PRICE)
    return products.reduce(
      (totalPrice, p) => totalPrice + p.fullPrice * p.count,
      0
    );

  return 0;
};

export default getConditionValue;
