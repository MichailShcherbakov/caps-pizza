import { ISuitableDiscount } from "./get-suitable-discounts";

export const orderDiscountsByProfitable = (
  discounts: ISuitableDiscount[]
): ISuitableDiscount[] => {
  const clone = [...discounts];
  return clone.sort((a, b) => b.discountValue - a.discountValue);
};

export default orderDiscountsByProfitable;
