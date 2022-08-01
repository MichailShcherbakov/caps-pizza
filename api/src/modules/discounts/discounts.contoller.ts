import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from "@nestjs/common";
import DiscountEntity from "~/db/entities/discount.entity";
import { CreateDiscountDto } from "./discounts.dto";
import DiscountsService from "./discounts.service";

@Controller("/discounts")
export default class DiscountsContoller {
  constructor(private discountsService: DiscountsService) {}

  @Get("/")
  getDiscounts(): Promise<DiscountEntity[]> {
    return this.discountsService.find();
  }

  @Get("/:discountUUID")
  async getDiscount(
    @Param("discountUUID", ParseUUIDPipe) discountUUID: string
  ): Promise<DiscountEntity> {
    const foundDiscount = await this.discountsService.findOne({
      uuid: discountUUID,
    });

    if (!foundDiscount)
      throw new NotFoundException(
        `The discount ${discountUUID} does not exist`
      );

    return foundDiscount;
  }

  @Post("/")
  createDiscount(@Body() dto: CreateDiscountDto): Promise<DiscountEntity> {
    return this.discountsService.create(dto);
  }

  @Delete("/:discountUUID")
  async deleteDiscount(
    @Param("discountUUID", ParseUUIDPipe) discountUUID: string
  ): Promise<void> {
    await this.discountsService.delete(discountUUID);
  }
}
