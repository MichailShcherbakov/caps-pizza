import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ProductEntity from "~/db/entities/product.entity";
import ModifiersModule from "../modifiers/modifiers.module";
import ProductCategoriesModule from "./modules/categories/categories.module";
import ProductsController from "./products.controller";
import ProductsService from "./products.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    ProductCategoriesModule,
    forwardRef(() => ModifiersModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService, ProductCategoriesModule],
})
export default class ProductsModule {}
