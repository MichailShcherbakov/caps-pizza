import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import UploaderModule from "./modules/uploader/uploader.module";
import ProductsModule from "./modules/products/products.module";
import { MulterModule } from "@nestjs/platform-express";
import { APP_ROOT_PATH } from "./config";

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL || ""),
    MulterModule.register({
      dest: APP_ROOT_PATH + "/static/images",
    }),
    ProductsModule,
    UploaderModule,
  ],
})
export class AppModule {}
