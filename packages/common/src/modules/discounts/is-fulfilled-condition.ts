import { DiscountOperatorEnum, IDiscountCondition } from "../../interfaces";

export const isFulfilledCondition = (
  condition: IDiscountCondition,
  value: number
): boolean => {
  switch (condition.op) {
    case DiscountOperatorEnum.EQUAL: {
      return Boolean(Math.floor(value / condition.value));
    }
    case DiscountOperatorEnum.GREATER: {
      return value > condition.value;
    }
    case DiscountOperatorEnum.LESS: {
      return value < condition.value;
    }
    case DiscountOperatorEnum.BETWEEN: {
      return (
        condition.value2 !== undefined &&
        value >= Math.min(condition.value, condition.value2) &&
        value <= Math.max(condition.value, condition.value2)
      );
    }
    default: {
      return false;
    }
  }
};

export default isFulfilledCondition;
