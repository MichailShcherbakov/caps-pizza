import { Column, Entity } from "typeorm";
import IEntity from "./entity.inteface";

@Entity("shopping_cart_settings")
export class ShoppingCartSettingsEntity extends IEntity {
  @Column()
  minimum_order_amount: number;
}

export default ShoppingCartSettingsEntity;
