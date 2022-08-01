import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import ProductCategoryEntity from "~/db/entities/product-category.entity";
import { CreateProductCategoryDto } from "./categories.dto";

@Injectable()
export default class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private productCategoriesRepository: Repository<ProductCategoryEntity>
  ) {}

  find(
    options: FindOptionsWhere<ProductCategoryEntity> = {}
  ): Promise<ProductCategoryEntity[]> {
    return this.productCategoriesRepository.find({ where: options });
  }

  findOne(
    options: FindOptionsWhere<ProductCategoryEntity> = {}
  ): Promise<ProductCategoryEntity | null> {
    return this.productCategoriesRepository.findOne({ where: options });
  }

  create(options: CreateProductCategoryDto): Promise<ProductCategoryEntity> {
    const newProductCategory = new ProductCategoryEntity();
    newProductCategory.name = options.name;
    newProductCategory.image_url = options.image_url;

    return this.productCategoriesRepository.save(newProductCategory);
  }

  async delete(uuid: string): Promise<void> {
    const foundProductCategory = await this.findOne({ uuid });

    if (!foundProductCategory)
      throw new NotFoundException(
        "The product category " + uuid + " does not exist"
      );

    await this.productCategoriesRepository.delete({ uuid });
  }
}
