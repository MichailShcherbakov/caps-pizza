import IEntity from "./entity.interface";

export interface IShoppingCartSettings extends IEntity {
  minimum_order_amount: number;
}

export default IShoppingCartSettings;
