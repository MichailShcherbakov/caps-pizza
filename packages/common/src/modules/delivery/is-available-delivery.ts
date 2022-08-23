import { IDelivery } from "../../interfaces";
import getAvailableDeliveries, {
  getAvailableDeliveriesOptions,
} from "./get-available-deliveries";

export const isAvailableDelivery = (
  delivery: IDelivery,
  options: getAvailableDeliveriesOptions
): boolean => {
  const availableDeliveries = getAvailableDeliveries(options);
  return availableDeliveries.some(d => d.uuid === delivery.uuid);
};

export default isAvailableDelivery;
