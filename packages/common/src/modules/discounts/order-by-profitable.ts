import { ISuitableDiscount } from "./get-suitable-discounts";

export const orderByProfitable = (
  discounts: ISuitableDiscount[]
): ISuitableDiscount[] => {
  const clone = [...discounts];
  return clone.sort((a, b) => b.discountValue - a.discountValue);
};

export default orderByProfitable;
