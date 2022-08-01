import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import { APP_ROOT_PATH, TYPEORM_CONFIG } from "./config";
import UploaderModule from "./modules/uploader/uploader.module";
import ProductsModule from "./modules/products/products.module";
import DiscountsModule from "./modules/discounts/discounts.module";
import OrderModule from "./modules/order/order.module";
import ModifiersModule from "./modules/modifiers/modifiers.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(TYPEORM_CONFIG),
    MulterModule.register({
      dest: APP_ROOT_PATH + "/static/images",
    }),
    ProductsModule,
    ModifiersModule,
    DiscountsModule,
    OrderModule,
    UploaderModule,
  ],
})
export default class AppModule {}
