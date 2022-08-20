import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import UploaderModule from "./modules/uploader/uploader.module";
import ProductsModule from "./modules/products/products.module";
import DiscountsModule from "./modules/discounts/discounts.module";
import OrderModule from "./modules/orders/orders.module";
import ModifiersModule from "./modules/modifiers/modifiers.module";
import SyncModule from "./modules/sync/sync.module";
import DeliveryModule from "./modules/delivery/deliveries.module";
import AuthModule from "./modules/auth/auth.module";
import UsersModule from "./modules/users/users.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(__TYPEORM_CONFIG__),
    MulterModule.register(),
    ProductsModule,
    ModifiersModule,
    DiscountsModule,
    DeliveryModule,
    OrderModule,
    UploaderModule,
    SyncModule,
    AuthModule,
    UsersModule,
  ],
})
export default class AppModule {}
