import { DeliveryTypeEnum, IDelivery } from "../../interfaces";

export const calculateDelivery = (options: {
  delivery: IDelivery;
  orderCost: number;
}): number => {
  const { delivery, orderCost } = options;

  switch (delivery.type) {
    case DeliveryTypeEnum.PERCENT: {
      return (orderCost * delivery.value) / 100;
    }
    case DeliveryTypeEnum.IN_CASH:
    default: {
      return delivery.value;
    }
  }
};

export default calculateDelivery;
