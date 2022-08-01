import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from "@nestjs/common";
import ModifierCategoryEntity from "~/db/entities/modifier-category.entity";
import { CreateModifierCategoryDto } from "./categories.dto";
import ModifierCategoriesService from "./categories.service";

@Controller("/modifiers/categories")
export default class ModifierCategoriesController {
  constructor(
    private readonly modifierCategoriesService: ModifierCategoriesService
  ) {}

  @Get("/")
  getModifierCategories(): Promise<ModifierCategoryEntity[]> {
    return this.modifierCategoriesService.find();
  }

  @Get("/:modifierCategoryUUID")
  async getModifierCategory(
    @Param("modifierCategoryUUID", ParseUUIDPipe) modifierCategoryUUID: string
  ): Promise<ModifierCategoryEntity> {
    const foundModifierCategory = await this.modifierCategoriesService.findOne({
      uuid: modifierCategoryUUID,
    });

    if (!foundModifierCategory)
      throw new NotFoundException(
        `The modifier category ${modifierCategoryUUID} does not exist`
      );

    return foundModifierCategory;
  }

  @Post("/")
  createModifierCategory(
    @Body() dto: CreateModifierCategoryDto
  ): Promise<ModifierCategoryEntity> {
    return this.modifierCategoriesService.create(dto);
  }

  @Delete("/:modifierCategoryUUID")
  deleteModifierCategory(
    @Param("modifierCategoryUUID", ParseUUIDPipe) modifierCategoryUUID: string
  ): Promise<void> {
    return this.modifierCategoriesService.delete(modifierCategoryUUID);
  }
}
