import { Body, Controller, Post } from "@nestjs/common";
import { MakeAnOrderDto } from "./order.dto";
import OrderService from "./order.service";

@Controller("/order")
export default class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  makeAnOrder(@Body() dto: MakeAnOrderDto) {
    return this.orderService.makeAnOrder(dto);
  }
}
