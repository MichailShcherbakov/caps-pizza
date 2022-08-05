import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from "@nestjs/common";
import ProductEntity from "~/db/entities/product.entity";
import { CreateProductDto, UpdateProductDto } from "./products.dto";
import ProductsService from "./products.service";

@Controller("/products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get("/")
  getAllProducts(): Promise<ProductEntity[]> {
    return this.productsService.find();
  }

  @Get("/(:productUUID)/$")
  async getProduct(
    @Param("productUUID", ParseUUIDPipe) productUUID: string
  ): Promise<ProductEntity> {
    const foundProduct = await this.productsService.findOne({
      uuid: productUUID,
    });

    if (!foundProduct)
      throw new NotFoundException(`The product ${productUUID} does not exist`);

    return foundProduct;
  }

  @Post("/")
  createProduct(
    @Body() createProductDto: CreateProductDto
  ): Promise<ProductEntity> {
    return this.productsService.create(createProductDto);
  }

  @Put("/:productUUID/$")
  updateProduct(
    @Param("productUUID", ParseUUIDPipe) productUUID: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<ProductEntity> {
    return this.productsService.update(productUUID, updateProductDto);
  }

  @Delete("/:productUUID/$")
  async deleteProduct(
    @Param("productUUID", ParseUUIDPipe) productUUID: string
  ): Promise<void> {
    await this.productsService.delete(productUUID);
  }
}

export default ProductsController;
