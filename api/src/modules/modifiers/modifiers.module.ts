import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ModifierEntity from "~/db/entities/modifier.entity";
import SyncModule from "../sync/sync.module";
import ModifiersController from "./modifiers.controller";
import ModifiersService from "./modifiers.service";
import ModifierCategoriesModule from "./modules/categories/categories.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ModifierEntity]),
    ModifierCategoriesModule,
    forwardRef(() => SyncModule),
  ],
  controllers: [ModifiersController],
  providers: [ModifiersService],
  exports: [ModifiersService, ModifierCategoriesModule],
})
export default class ModifiersModule {}
