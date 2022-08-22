import { IDiscount } from "../../interfaces";
import getFinalDiscountValue from "./get-final-discount-value";
import getSuitableDiscount, { IOrderedProduct } from "./get-suitable-discount";

export const calculateDiscountValue = (options: {
  discounts: IDiscount[];
  products: IOrderedProduct[];
}): number => {
  const suitableDiscount = getSuitableDiscount(options);

  if (!suitableDiscount) return 0;

  const { discount, products, conditionValue, totalCost } = suitableDiscount;

  return getFinalDiscountValue({
    products,
    discount,
    conditionValue,
    totalCost,
  });
};

export default calculateDiscountValue;
