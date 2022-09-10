import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from "@nestjs/common";
import PromotionEntity from "~/db/entities/promotion.entity";
import AuthGuard from "../auth/auth.guard";
import { CreatePromotionDto, UpdatePromotionDto } from "./promotions.dto";
import PromotionsService from "./promotions.service";

@Controller("/promotions")
export default class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get("/")
  getPromotions(): Promise<PromotionEntity[]> {
    return this.promotionsService.find();
  }

  @Get("/:promotionUUID")
  getPromotion(
    @Param("promotionUUID", ParseUUIDPipe) promotionUUID: string
  ): Promise<PromotionEntity> {
    return this.promotionsService.findOneOrFail({
      uuid: promotionUUID,
    });
  }

  @AuthGuard()
  @Post("/")
  createPromotion(@Body() dto: CreatePromotionDto): Promise<PromotionEntity> {
    return this.promotionsService.create(dto);
  }

  @AuthGuard()
  @Put("/:promotionUUID")
  updatePromotion(
    @Param("promotionUUID", ParseUUIDPipe) promotionUUID: string,
    @Body() dto: UpdatePromotionDto
  ): Promise<PromotionEntity> {
    return this.promotionsService.update(promotionUUID, dto);
  }

  @AuthGuard()
  @Delete("/:promotionUUID")
  deletePromotion(
    @Param("promotionUUID", ParseUUIDPipe) promotionUUID: string
  ): Promise<void> {
    return this.promotionsService.delete(promotionUUID);
  }
}
