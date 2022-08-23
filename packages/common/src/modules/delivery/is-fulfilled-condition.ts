import { DeliveryOperatorEnum, IDelivery } from "../../interfaces";

export const isFulfilledCondition = (
  delivery: IDelivery,
  value: number
): boolean => {
  switch (delivery.condition.op) {
    case DeliveryOperatorEnum.EQUAL: {
      return value === delivery.condition.value;
    }
    case DeliveryOperatorEnum.GREATER: {
      return value > delivery.condition.value;
    }
    case DeliveryOperatorEnum.LESS: {
      return value < delivery.condition.value;
    }
    case DeliveryOperatorEnum.BETWEEN: {
      return (
        delivery.condition.value2 !== undefined &&
        value >=
          Math.min(delivery.condition.value, delivery.condition.value2) &&
        value <= Math.max(delivery.condition.value, delivery.condition.value2)
      );
    }
    default: {
      return false;
    }
  }
};

export default isFulfilledCondition;
