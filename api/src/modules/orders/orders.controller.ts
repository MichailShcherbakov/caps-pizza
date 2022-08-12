import { Body, Controller, Post } from "@nestjs/common";
import { FrontPadResponse, MakeAnOrderDto } from "./orders.dto";
import OrderService from "./orders.service";

@Controller("/orders")
export default class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Post("/")
  makeAnOrder(@Body() dto: MakeAnOrderDto): Promise<FrontPadResponse> {
    return this.orderService.makeAnOrder(dto);
  }
}
