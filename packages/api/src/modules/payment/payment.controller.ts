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
import PaymentEntity from "~/db/entities/payment.entity";
import AuthGuard from "../auth/auth.guard";
import { CreatePaymentDto, UpdatePaymentDto } from "./orders.dto";
import PaymentService from "./payment.service";

@Controller("/payments")
export default class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get("/")
  getPayments(): Promise<PaymentEntity[]> {
    return this.paymentService.find();
  }

  @Get("/:paymentUUID")
  getPayment(
    @Param("paymentUUID", ParseUUIDPipe) paymentUUID: string
  ): Promise<PaymentEntity> {
    return this.paymentService.findOneOrFail({ uuid: paymentUUID });
  }

  @AuthGuard()
  @Post("/")
  createPayment(@Body() dto: CreatePaymentDto): Promise<PaymentEntity> {
    return this.paymentService.create(dto);
  }

  @AuthGuard()
  @Put("/:paymentUUID")
  updatePayment(
    @Param("paymentUUID", ParseUUIDPipe) paymentUUID: string,
    @Body() dto: UpdatePaymentDto
  ): Promise<PaymentEntity> {
    return this.paymentService.update(paymentUUID, dto);
  }

  @AuthGuard()
  @Delete("/:paymentUUID")
  deletePayment(
    @Param("paymentUUID", ParseUUIDPipe) paymentUUID: string
  ): Promise<void> {
    return this.paymentService.delete(paymentUUID);
  }
}
