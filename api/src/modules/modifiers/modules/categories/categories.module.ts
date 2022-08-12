import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ModifierCategoryEntity from "~/db/entities/modifier-category.entity";
import ModifierCategoriesController from "./categories.controller";
import ModifierCategoriesService from "./categories.service";

@Module({
  imports: [TypeOrmModule.forFeature([ModifierCategoryEntity])],
  controllers: [ModifierCategoriesController],
  providers: [ModifierCategoriesService],
  exports: [ModifierCategoriesService],
})
export default class ModifierCategoriesModule {}
