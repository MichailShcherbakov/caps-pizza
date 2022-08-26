import {
  DiscountCriteriaEnum,
  IDiscountCondition,
  IProductWithFullPrice,
} from "../../interfaces";

export const getConditionValue = (
  condition: IDiscountCondition,
  products: IProductWithFullPrice[]
): number => {
  if (condition.criteria === DiscountCriteriaEnum.COUNT)
    return Math.floor(products.reduce((count, p) => count + p.count, 0));

  if (condition.criteria === DiscountCriteriaEnum.PRICE)
    return products.reduce(
      (totalPrice, p) => totalPrice + p.fullPrice * p.count,
      0
    );

  return 0;
};

export default getConditionValue;
