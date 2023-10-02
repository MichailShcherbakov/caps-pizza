import {
  IClientInfo,
  IDeliveryAddress,
  IOrder,
  IOrderedModifier,
  IOrderedProduct,
} from "@monorepo/common";
import API from "./api.service";
import transformResponse, {
  APIData,
  APIPayload,
} from "./helpers/transform-response.helper";

export class OrderedModifier implements IOrderedModifier {
  uuid: string;
}

export class OrderedProduct implements IOrderedProduct {
  uuid: string;
  count: number;
  modifiers: OrderedModifier[];
}

export class DeliveryAddress implements IDeliveryAddress {
  street: string;
  house: string;
  building?: string;
  entrance: number;
  floor: number;
  apartment: number;
}

export class ClientInfo implements IClientInfo {
  name: string;
  phone: string;
  email?: string;
}

export class Order implements IOrder {
  products: OrderedProduct[];
  delivery_address: DeliveryAddress;
  score?: number;
  card?: number;
  client_info: ClientInfo;
  description?: string;
  delivery_uuid?: string;
  payment_uuid: string;
}

export interface MadeOrder {
  order_id: number;
  order_number: number;
}

export const OrdersAPI = API.injectEndpoints({
  endpoints: builder => ({
    makeOrder: builder.mutation<APIData<MadeOrder>, APIPayload<Order>>({
      query: body => ({
        url: `/orders`,
        method: "POST",
        body,
      }),
      transformResponse,
    }),
  }),
  overrideExisting: false,
});

export const { useMakeOrderMutation } = OrdersAPI;

export default OrdersAPI;
