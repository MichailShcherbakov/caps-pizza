import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import DiscountEntity from "~/db/entities/discount.entity";
import DiscountsContoller from "./discounts.contoller";
import DiscountsService from "./discounts.service";

@Module({
  imports: [TypeOrmModule.forFeature([DiscountEntity])],
  controllers: [DiscountsContoller],
  providers: [DiscountsService],
  exports: [DiscountsService],
})
export default class DiscountsModule {}
