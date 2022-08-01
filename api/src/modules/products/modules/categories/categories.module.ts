import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ProductCategoryEntity from "~/db/entities/product-category.entity";
import ProductCategoriesController from "./categories.controller";
import ProductCategoriesService from "./categories.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategoryEntity])],
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService],
  exports: [ProductCategoriesService],
})
export default class ProductCategoriesModule {}
