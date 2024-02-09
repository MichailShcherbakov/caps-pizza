import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ShoppingCartSettingsEntity from "~/db/entities/shopping-cart-settings.entity";
import ShoppingCartSettingsController from "./shopping-cart-settings.controller";
import ShoppingCartSettingsService from "./shopping-cart-settings.service";

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingCartSettingsEntity])],
  controllers: [ShoppingCartSettingsController],
  providers: [ShoppingCartSettingsService],
  exports: [ShoppingCartSettingsService],
})
export default class ShoppingCartSettingsModule {}
