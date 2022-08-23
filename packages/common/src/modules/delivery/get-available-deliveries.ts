import { DeliveryCriteriaEnum, IDelivery } from "../../interfaces";
import calculateDelivery from "./calculate-delivery";
import isFulfilledCondition from "./is-fulfilled-condition";

export interface getAvailableDeliveriesOptions {
  deliveries: IDelivery[];
  orderedProductsCount: number;
  orderCost: number;
}

export const getAvailableDeliveries = ({
  deliveries,
  orderedProductsCount,
  orderCost,
}: getAvailableDeliveriesOptions): IDelivery[] => {
  const availableDeliveries = deliveries.filter(delivery => {
    switch (delivery.condition.criteria) {
      case DeliveryCriteriaEnum.COUNT: {
        return isFulfilledCondition(delivery, orderedProductsCount);
      }
      case DeliveryCriteriaEnum.PRICE: {
        return isFulfilledCondition(delivery, orderCost);
      }
      default: {
        return false;
      }
    }
  });

  return availableDeliveries.sort(
    (a, b) =>
      calculateDelivery({ delivery: b, orderCost }) -
      calculateDelivery({ delivery: a, orderCost })
  );
};

export default getAvailableDeliveries;
