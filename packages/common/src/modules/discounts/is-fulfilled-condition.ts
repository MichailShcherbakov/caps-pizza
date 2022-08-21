import { DiscountOperatorEnum, IDiscount } from "../../interfaces";

export const isFulfilledCondition = (
  discount: IDiscount,
  value: number,
  strict = false
): boolean => {
  switch (discount.condition.op) {
    case DiscountOperatorEnum.EQUAL: {
      if (strict) return value === discount.condition.value;

      return Boolean(Math.floor(value / discount.condition.value));
    }
    case DiscountOperatorEnum.GREATER: {
      return value > discount.condition.value;
    }
    case DiscountOperatorEnum.LESS: {
      return value < discount.condition.value;
    }
    case DiscountOperatorEnum.BETWEEN: {
      return (
        discount.condition.value2 !== undefined &&
        value >=
          Math.min(discount.condition.value, discount.condition.value2) &&
        value <= Math.max(discount.condition.value, discount.condition.value2)
      );
    }
    default: {
      return false;
    }
  }
};

export default isFulfilledCondition;
