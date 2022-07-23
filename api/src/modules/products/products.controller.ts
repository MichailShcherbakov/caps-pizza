import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { Product } from "~/schemas/product.schema";
import { CreateProductDto, UpdateProductDto } from "./products.dto";
import ProductsService from "./products.service";

@Controller("/products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get("/")
  getAllProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get("/:productId")
  async getProduct(@Param("productId") productId: string): Promise<Product> {
    const foundProduct = await this.productsService.find({ id: productId });

    if (!foundProduct) throw new NotFoundException();

    return foundProduct;
  }

  @Post("/")
  createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put("/:productId")
  async updateProduct(
    @Param("productId") productId: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<void> {
    await this.productsService.update(productId, updateProductDto);
  }

  @Delete("/:productId")
  async deleteProduct(@Param("productId") productId: string): Promise<void> {
    await this.productsService.delete(productId);
  }
}

export default ProductsController;
