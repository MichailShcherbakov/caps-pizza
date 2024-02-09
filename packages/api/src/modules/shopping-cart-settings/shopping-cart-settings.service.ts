import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import ShoppingCartSettingsEntity from "~/db/entities/shopping-cart-settings.entity";
import { SetShoppingCartSettings } from "./shopping-cart-settings.dto";

@Injectable()
export default class ShoppingCartSettingsService {
  constructor(
    @InjectRepository(ShoppingCartSettingsEntity)
    private readonly settingsRepository: Repository<ShoppingCartSettingsEntity>
  ) {}

  getSettings(): Promise<ShoppingCartSettingsEntity> {
    return this.settingsRepository.findOneByOrFail({});
  }

  async setSettings(
    payload: SetShoppingCartSettings
  ): Promise<ShoppingCartSettingsEntity> {
    const settings = await this.getSettings();

    settings.minimum_order_amount = payload.minimum_order_amount;

    return this.settingsRepository.save(settings);
  }
}
