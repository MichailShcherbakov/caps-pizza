import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import { APP_ROOT_PATH, TYPEORM_CONFIG } from "./config";
import UploaderModule from "./modules/uploader/uploader.module";
import ProductsModule from "./modules/products/products.module";
import CategoriesModule from "./modules/categories/categories.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(TYPEORM_CONFIG),
    MulterModule.register({
      dest: APP_ROOT_PATH + "/static/images",
    }),
    ProductsModule,
    UploaderModule,
    CategoriesModule,
  ],
})
export class AppModule {}
