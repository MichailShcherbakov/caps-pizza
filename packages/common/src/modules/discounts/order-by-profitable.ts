import { DiscountScopeEnum, IDiscount } from "../../interfaces";

export const orderByProfitable = (discounts: IDiscount[]): IDiscount[] => {
  return discounts.sort((a, b) => {
    switch (a.scope) {
      case DiscountScopeEnum.PRODUCTS: {
        if (b.scope !== DiscountScopeEnum.PRODUCTS) return -1;
        return 0;
      }
      case DiscountScopeEnum.PRODUCT_FEATURES: {
        if (b.scope === DiscountScopeEnum.PRODUCTS) return 1;
        else if (b.scope === DiscountScopeEnum.GLOBAL) return -1;
        return 0;
      }
      case DiscountScopeEnum.GLOBAL: {
        if (b.scope === DiscountScopeEnum.GLOBAL) return 0;
        return 1;
      }
      default: {
        return 0;
      }
    }
  });
};

export default orderByProfitable;
