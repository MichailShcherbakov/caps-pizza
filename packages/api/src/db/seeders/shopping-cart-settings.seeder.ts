import { QueryRunner } from "typeorm";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import ShoppingCartSettingsEntity from "../entities/shopping-cart-settings.entity";

export class ShoppingCartSettingsFactory extends IFactory<ShoppingCartSettingsEntity> {
  create(options?: Partial<ShoppingCartSettingsEntity>): ShoppingCartSettingsEntity {
    const e = new ShoppingCartSettingsEntity();
    e.minimum_order_amount = options?.minimum_order_amount ?? 0;
    return e;
  }
}

export default class ShoppingCartSettingsSeeder extends ISeeder<ShoppingCartSettingsEntity> {
  constructor(q: QueryRunner) {
    super(q, new ShoppingCartSettingsFactory());
  }
}
