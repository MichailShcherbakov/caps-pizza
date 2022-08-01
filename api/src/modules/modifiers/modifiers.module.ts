import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ModifierEntity from "~/db/entities/modifier.entity";
import ModifiersController from "./modifiers.controller";
import ModifiersService from "./modifiers.service";
import ModifierCategoriesModule from "./modules/categories/categories.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ModifierEntity]),
    ModifierCategoriesModule,
  ],
  controllers: [ModifiersController],
  providers: [ModifiersService],
  exports: [ModifiersService, ModifierCategoriesModule],
})
export default class ModifiersModule {}
