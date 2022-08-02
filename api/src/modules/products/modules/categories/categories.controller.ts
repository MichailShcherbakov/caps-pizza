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
import ProductCategoryEntity from "~/db/entities/product-category.entity";
import { CreateProductCategoryDto } from "./categories.dto";
import ProductCategoriesService from "./categories.service";

@Controller("/products/categories")
export default class ProductCategoriesController {
  constructor(private productCategoriesService: ProductCategoriesService) {}

  @Get("/")
  getProductCategories(): Promise<ProductCategoryEntity[]> {
    return this.productCategoriesService.find();
  }

  @Get("/:productCategoryUUID/$")
  async getProdutCategory(
    @Param("productCategoryUUID", ParseUUIDPipe) productCategoryUUID: string
  ): Promise<ProductCategoryEntity> {
    const foundProductCategory = await this.productCategoriesService.findOne({
      uuid: productCategoryUUID,
    });

    if (!foundProductCategory)
      throw new NotFoundException(
        `The product category ${productCategoryUUID} does not exist`
      );

    return foundProductCategory;
  }

  @Post("/")
  createCategory(
    @Body() createProductCategoryDto: CreateProductCategoryDto
  ): Promise<ProductCategoryEntity> {
    return this.productCategoriesService.create(createProductCategoryDto);
  }

  @Delete("/:productCategoryUUID")
  deleteCategory(
    @Param("productCategoryUUID", ParseUUIDPipe) productCategoryUUID: string
  ): Promise<void> {
    return this.productCategoriesService.delete(productCategoryUUID);
  }
}
