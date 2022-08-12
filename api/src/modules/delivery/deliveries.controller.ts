import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from "@nestjs/common";
import DeliveryEntity from "~/db/entities/delivery.entity";
import { CreateDeliveryDto, UpdateDeliveryDto } from "./deliveries.dto";
import DeliveryService from "./deliveries.service";

@Controller("/deliveries")
export default class DeliveriesController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get("/")
  getDeliveries(): Promise<DeliveryEntity[]> {
    return this.deliveryService.find();
  }

  @Get("/:deliveryUUID")
  async getDelivery(
    @Param("deliveryUUID", ParseUUIDPipe) deliveryUUID: string
  ): Promise<DeliveryEntity> {
    const foundDelivery = await this.deliveryService.findOne({
      uuid: deliveryUUID,
    });

    if (!foundDelivery)
      throw new NotFoundException(
        `The delivery ${deliveryUUID} does not exist`
      );

    return foundDelivery;
  }

  @Post("/")
  createDelivery(@Body() dto: CreateDeliveryDto): Promise<DeliveryEntity> {
    return this.deliveryService.create(dto);
  }

  @Put("/:deliveryUUID")
  updateDelivery(
    @Param("deliveryUUID", ParseUUIDPipe) deliveryUUID: string,
    @Body() dto: UpdateDeliveryDto
  ): Promise<DeliveryEntity> {
    return this.deliveryService.update(deliveryUUID, dto);
  }

  @Delete("/:deliveryUUID")
  deleteDelivery(@Param("deliveryUUID", ParseUUIDPipe) deliveryUUID: string) {
    return this.deliveryService.delete(deliveryUUID);
  }
}
