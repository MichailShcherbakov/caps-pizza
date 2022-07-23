import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { Product } from '~/schemas/product.schema';
import { CreateProductDto } from './products.dto';
import ProductsService from './products.service';

@Controller('/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('/')
  getAllProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get('/:productUUID')
  async getProduct(
    @Param('productUUID') productUUID: string,
  ): Promise<Product> {
    const foundProduct = await this.productsService.find({ uuid: productUUID });

    if (!foundProduct) throw new NotFoundException();

    return foundProduct;
  }

  @Post('/')
  createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }
}

export default ProductsController;
