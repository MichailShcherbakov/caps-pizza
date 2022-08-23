export interface IOrderedModifier {
  uuid: string;
}

export interface IOrderedProduct {
  uuid: string;
  count: number;
  modifiers: IOrderedModifier[];
}

export interface IDeliveryAddress {
  street: string;
  house: string;
  entrance: number;
  floor: number;
  apartment: number;
}

export interface IClientInfo {
  name: string;
  phone: string;
  email?: string;
}

export interface IOrder {
  products: IOrderedProduct[];
  delivery_address: IDeliveryAddress;
  score?: number;
  card?: number;
  client_info: IClientInfo;
  description?: string;
  delivery_uuid?: string;
  payment_uuid: string;
}

export default IOrder;
