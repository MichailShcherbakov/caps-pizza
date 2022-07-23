import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "~/schemas/product.schema";
import { CreateProductDto, UpdateProductDto } from "./products.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find().where("deleted_at").exists(false).exec();
  }

  async find({ id }: { id: string }): Promise<Product | null> {
    return this.productModel
      .findOne()
      .where("_id")
      .equals(id)
      .where("deleted_at")
      .exists(false)
      .exec();
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productModel.create({
      name: createProductDto.name,
      desc: createProductDto.desc,
      imageURL: createProductDto.imageURL,
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    const foundProduct = await this.productModel.findOne({ _id: id }).exec();

    if (!foundProduct) throw new NotFoundException();

    return foundProduct.update(updateProductDto).exec();
  }

  async delete(id: string): Promise<void> {
    this.productModel.updateOne({ _id: id }, { deleted_at: new Date() }).exec();
  }
}

export default ProductsService;
