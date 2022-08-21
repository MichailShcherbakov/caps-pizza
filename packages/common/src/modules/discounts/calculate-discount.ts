import {
  DiscountCriteriaEnum,
  DiscountScopeEnum,
  IDiscount,
  IProduct,
} from "../../interfaces";
import getConditionValue from "./get-condition-value";
import getFinalDiscount from "./get-final-discount";
import isFulfilledCondition from "./is-fulfilled-condition";
import orderByProfitable from "./order-by-profitable";

export interface IOrder {}

export interface IOrderedProduct extends IProduct {
  count: number;
  fullPrice: number;
}

export const calculateDiscount = (options: {
  discounts: IDiscount[];
  products: IOrderedProduct[];
}): number => {
  const { discounts, products } = options;

  const orderedDiscountsByProfitable = orderByProfitable(discounts);

  const totalCost = products.reduce(
    (cost, p) => cost + p.fullPrice * p.count,
    0
  );

  for (const discount of orderedDiscountsByProfitable) {
    let validatedProducts: IOrderedProduct[] = [];

    switch (discount.scope) {
      case DiscountScopeEnum.PRODUCTS: {
        if (discount.condition.criteria === DiscountCriteriaEnum.PRICE)
          throw new Error("The invalid discount");

        const discountProductsUUIDs = new Set(
          discount.products.map(p => p.uuid)
        );

        validatedProducts = products.filter(p =>
          discountProductsUUIDs.has(p.uuid)
        );

        break;
      }
      case DiscountScopeEnum.PRODUCT_FEATURES: {
        const discountProductCategoriesUUIDs = new Set(
          discount.product_categories.map(c => c.uuid)
        );

        validatedProducts = products.filter(p => {
          const productModifiersUUIDs = new Set(p.modifiers.map(c => c.uuid));

          const hasCategory = discountProductCategoriesUUIDs.has(
            p.category_uuid
          );

          const hasModifier = discount.modifiers.every(m =>
            productModifiersUUIDs.has(m.uuid)
          );

          return (
            (!discount.product_categories.length || hasCategory) && hasModifier
          );
        });

        break;
      }
      case DiscountScopeEnum.GLOBAL: {
        validatedProducts = products;
        break;
      }
    }

    const conditionValue = getConditionValue(discount, validatedProducts);

    if (
      !isFulfilledCondition(
        discount,
        conditionValue,
        discount.scope === DiscountScopeEnum.GLOBAL
      )
    )
      break;

    return getFinalDiscount({
      products: validatedProducts,
      discount,
      conditionValue,
      totalCost,
    });
  }

  return 0;
};

export default calculateDiscount;
