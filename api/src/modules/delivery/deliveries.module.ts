import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import DeliveriesEntity from "~/db/entities/delivery.entity";
import SyncModule from "../sync/sync.module";
import DeliveriesController from "./deliveries.controller";
import DeliveriesService from "./deliveries.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveriesEntity]),
    forwardRef(() => SyncModule),
  ],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
  exports: [DeliveriesService],
})
export default class DeliveriesModule {}
