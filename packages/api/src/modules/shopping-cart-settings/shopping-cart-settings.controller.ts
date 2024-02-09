import { Body, Controller, Get, Put } from "@nestjs/common";
import ShoppingCartSettingsEntity from "~/db/entities/shopping-cart-settings.entity";
import ShoppingCartSettingsService from "./shopping-cart-settings.service";
import { SetShoppingCartSettings } from "./shopping-cart-settings.dto";
import AuthGuard from "../auth/auth.guard";

@Controller("/shopping-cart-settings")
export default class ShoppingCartSettingsController {
  constructor(
    private readonly shoppingCartSettingsService: ShoppingCartSettingsService
  ) {}

  @Get("/")
  getSettings(): Promise<ShoppingCartSettingsEntity> {
    return this.shoppingCartSettingsService.getSettings();
  }

  @AuthGuard()
  @Put("/")
  setSettings(
    @Body() dto: SetShoppingCartSettings
  ): Promise<ShoppingCartSettingsEntity> {
    return this.shoppingCartSettingsService.setSettings(dto);
  }
}
