import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '~/schemas/product.schema';
import { CreateProductDto } from './products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async find({ uuid }: { uuid: string }): Promise<Product | null> {
    return this.productModel.findOne().where('uuid').equals(uuid).exec();
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productModel.create({
      name: createProductDto.name,
      desc: createProductDto.desc,
      imageURL: createProductDto.imageURL,
    });
  }
}

export default ProductsService;
