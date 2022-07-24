import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import CategoryEntity from "~/db/entities/category.entity";
import CategoriesController from "./categories.controller";
import CategoriesService from "./categories.service";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}

export default CategoriesModule;
