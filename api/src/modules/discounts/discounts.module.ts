import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import DiscountEntity from "~/db/entities/discount.entity";
import ModifiersModule from "../modifiers/modifiers.module";
import ProductCategoriesModule from "../products/modules/categories/categories.module";
import ProductsModule from "../products/products.module";
import DiscountsContoller from "./discounts.contoller";
import DiscountsService from "./discounts.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([DiscountEntity]),
    ProductCategoriesModule,
    ProductsModule,
    ModifiersModule,
  ],
  controllers: [DiscountsContoller],
  providers: [DiscountsService],
  exports: [DiscountsService],
})
export default class DiscountsModule {}
