import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import DeliveriesModule from "../delivery/deliveries.module";
import DiscountsModule from "../discounts/discounts.module";
import ModifiersModule from "../modifiers/modifiers.module";
import PaymentModule from "../payment/payment.module";
import ProductsModule from "../products/products.module";
import OrdersController from "./orders.controller";
import OrdersService from "./orders.service";
import ShoppingCartSettingsModule from "../shopping-cart-settings/shopping-cart-settings.module";

@Module({
  imports: [
    HttpModule,
    ProductsModule,
    ModifiersModule,
    DiscountsModule,
    DeliveriesModule,
    PaymentModule,
    ShoppingCartSettingsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export default class OrdersModule {}
