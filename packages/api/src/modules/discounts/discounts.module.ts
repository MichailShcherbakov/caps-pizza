import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import DiscountProductCategoryEntity from "~/db/entities/discount-product-category.entity";
import DiscountProductEntity from "~/db/entities/discount-product.entity";
import DiscountEntity from "~/db/entities/discount.entity";
import ModifiersModule from "../modifiers/modifiers.module";
import ProductCategoriesModule from "../products/modules/categories/categories.module";
import ProductsModule from "../products/products.module";
import DiscountsContoller from "./discounts.contoller";
import DiscountsService from "./discounts.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DiscountEntity,
      DiscountProductEntity,
      DiscountProductCategoryEntity,
    ]),
    ProductCategoriesModule,
    ProductsModule,
    ModifiersModule,
  ],
  controllers: [DiscountsContoller],
  providers: [DiscountsService],
  exports: [DiscountsService],
})
export default class DiscountsModule {}
