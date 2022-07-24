import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import CategoryEntity from "~/db/entities/category.entity";
import { CreateCategoryDto } from "./categories.dto";
import CategoriesService from "./categories.service";

@Controller("/categories")
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get("/")
  getCategories(): Promise<CategoryEntity[]> {
    return this.categoriesService.find();
  }

  @Get("/:categoryUUID")
  async getCategory(
    @Param("categoryUUID") categoryUUID: string
  ): Promise<CategoryEntity> {
    const foundCategory = await this.categoriesService.findOne({
      uuid: categoryUUID,
    });

    if (!foundCategory)
      throw new NotFoundException(
        "The category " + categoryUUID + " does not exist"
      );

    return foundCategory;
  }

  @Post("/")
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<CategoryEntity> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Delete("/:categoryUUID")
  async deleteCategory(
    @Param("categoryUUID") categoryUUID: string
  ): Promise<void> {
    await this.categoriesService.delete(categoryUUID);
  }
}

export default CategoriesController;
