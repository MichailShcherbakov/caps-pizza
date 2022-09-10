import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import PromotionEntity from "~/db/entities/promotion.entity";
import PromotionsController from "./promotions.controller";
import PromotionsService from "./promotions.service";

@Module({
  imports: [TypeOrmModule.forFeature([PromotionEntity])],
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService],
})
export default class PromotionsModule {}
