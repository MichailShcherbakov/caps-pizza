import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
  IDiscount,
  IProductWithFullPrice,
} from "../../interfaces";

export function getDiscountValue(
  discount: IDiscount,
  products: IProductWithFullPrice[],
  conditionValue: number,
  totalProductsCost: number
): number {
  const isGlobalScope =
    !discount.products.length &&
    !discount.modifiers.length &&
    !discount.product_categories.length;

  let discountValue = 0;

  switch (discount.type) {
    case DiscountTypeEnum.PERCENT: {
      let step = discount.condition.value;

      /* if (
        discount.condition.criteria === DiscountCriteriaEnum.COUNT ||
        discount.condition.op === DiscountOperatorEnum.EQUAL
      ) {
        let localDiscount = 0;
        let currentProductCount = 0;
        for (const product of products) {
          let availableProductCount = product.count;

          do {
            const productCount = Math.min(
              availableProductCount,
              discount.condition.value - currentProductCount
            );

            availableProductCount -= productCount;
            currentProductCount += productCount;
            localDiscount += product.fullPrice * productCount;

            if (currentProductCount === discount.condition.value) {
              discountValue += (localDiscount * discount.value) / 100;
              localDiscount = 0;
              currentProductCount = 0;
            } else if (currentProductCount < discount.condition.value) {
              break;
            }
          } while (availableProductCount);
        }
      } else {
        discountValue = (totalProductsCost * discount.value) / 100;
      } */

      if (discount.condition.op !== DiscountOperatorEnum.EQUAL) {
        break;
      }

      if (discount.products.length || discount.product_categories.length) {
        step =
          discount.condition.criteria === DiscountCriteriaEnum.COUNT
            ? products.length * discount.condition.value
            : Math.max(
                products.reduce((cost, p) => cost + p.fullPrice, 0),
                step
              );
      }

      discountValue =
        Math.floor(conditionValue / step) *
        ((totalProductsCost * discount.value) / 100);

      break;
    }
    case DiscountTypeEnum.IN_CASH: {
      let step = discount.condition.value;

      if (discount.condition.op !== DiscountOperatorEnum.EQUAL) {
        discountValue = discount.value;
        break;
      }

      if (discount.products.length || discount.product_categories.length) {
        step =
          discount.condition.criteria === DiscountCriteriaEnum.COUNT
            ? products.length * discount.condition.value
            : Math.max(
                products.reduce((cost, p) => cost + p.fullPrice, 0),
                step
              );
      }

      discountValue = Math.floor(conditionValue / step) * discount.value;

      break;
    }
    case DiscountTypeEnum.FIXED_PRICE: {
      /// The invalid discount
      if (
        isGlobalScope ||
        discount.condition.criteria !== DiscountCriteriaEnum.COUNT ||
        discount.condition.op !== DiscountOperatorEnum.EQUAL
      ) {
        discountValue = 0;
        break;
      }

      let localDiscount = 0;
      let currentProductCount = 0;
      for (const product of products) {
        let availableProductCount = product.count;

        do {
          const productCount = Math.min(
            availableProductCount,
            discount.condition.value - currentProductCount
          );

          availableProductCount -= productCount;
          currentProductCount += productCount;
          localDiscount += product.fullPrice * productCount;

          if (currentProductCount === discount.condition.value) {
            discountValue += localDiscount - discount.value;
            localDiscount = 0;
            currentProductCount = 0;
          } else if (currentProductCount < discount.condition.value) {
            break;
          }
        } while (availableProductCount);
      }
      break;
    }
  }

  return discountValue;
}

export default getDiscountValue;
