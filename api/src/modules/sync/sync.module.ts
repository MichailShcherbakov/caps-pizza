import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";
import DeliveriesModule from "../delivery/deliveries.module";
import ModifiersModule from "../modifiers/modifiers.module";
import ProductsModule from "../products/products.module";
import SyncService from "./sync.service";

@Module({
  imports: [
    HttpModule,
    forwardRef(() => ProductsModule),
    forwardRef(() => ModifiersModule),
    forwardRef(() => DeliveriesModule),
  ],
  providers: [SyncService],
  exports: [SyncService],
})
export default class SyncModule {}
