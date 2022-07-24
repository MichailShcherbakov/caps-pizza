import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import CategoryEntity from "~/db/entities/category.entity";
import ProductEntity from "~/db/entities/product.entity";
import CategoriesService from "../categories/categories.service";
import { CreateProductDto, UpdateProductDto } from "./products.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
    private categoriesService: CategoriesService
  ) {}

  find(
    options: FindOptionsWhere<ProductEntity> = {}
  ): Promise<ProductEntity[]> {
    return this.productsRepository.find({ where: options });
  }

  findOne(
    options: FindOptionsWhere<ProductEntity>
  ): Promise<ProductEntity | null> {
    return this.productsRepository.findOne({ where: options });
  }

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const foundCategory: CategoryEntity | null =
      await this.categoriesService.findOne({
        uuid: createProductDto.category_uuid,
      });

    if (!foundCategory)
      throw new NotFoundException(
        "The category " + createProductDto.category_uuid + " does not exist"
      );

    const newProduct = new ProductEntity();
    newProduct.name = createProductDto.name;
    newProduct.desc = createProductDto.desc;
    newProduct.image_url = createProductDto.image_url;
    newProduct.article_number = createProductDto.article_number;
    newProduct.category_uuid = createProductDto.category_uuid;

    return this.productsRepository.save(newProduct);
  }

  async updateOne(
    uuid: string,
    updateProductDto: UpdateProductDto
  ): Promise<ProductEntity> {
    const foundProduct = await this.findOne({ uuid });

    if (!foundProduct)
      throw new NotFoundException("The product " + uuid + " does not exist");

    foundProduct.name = updateProductDto.name || foundProduct.name;
    foundProduct.desc = updateProductDto.desc || foundProduct.desc;
    foundProduct.article_number =
      updateProductDto.article_number || foundProduct.article_number;

    if (updateProductDto.category_uuid) {
      const foundCategory: CategoryEntity | null =
        await this.categoriesService.findOne({
          uuid: updateProductDto.category_uuid,
        });

      if (!foundCategory)
        throw new NotFoundException(
          "The category " + updateProductDto.category_uuid + " does not exist"
        );

      foundProduct.category_uuid = foundCategory.uuid;
    }

    return this.productsRepository.save(foundProduct);
  }

  async update(
    options: FindOptionsWhere<ProductEntity>,
    updateProductDto: UpdateProductDto
  ): Promise<void> {
    this.productsRepository.update(options, updateProductDto);
  }

  async delete(uuid: string): Promise<void> {
    const foundProduct = await this.findOne({ uuid });

    if (!foundProduct)
      throw new NotFoundException("The product " + uuid + " does not exist");

    await this.productsRepository.delete({ uuid });
  }
}

export default ProductsService;
