import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Not, Repository } from "typeorm";
import ProductCategoryEntity from "~/db/entities/product-category.entity";
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from "./categories.dto";

@Injectable()
export default class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly productCategoriesRepository: Repository<ProductCategoryEntity>
  ) {}

  find(
    options?: FindOptionsWhere<ProductCategoryEntity>
  ): Promise<ProductCategoryEntity[]> {
    return this.productCategoriesRepository
      .find({
        where: options,
      })
      .then(categories => ProductCategoriesService.sort(categories));
  }

  static sort(categories: ProductCategoryEntity[]): ProductCategoryEntity[] {
    return categories.sort((a, b) => ProductCategoryEntity.compare(a, b));
  }

  findOne(
    options?: FindOptionsWhere<ProductCategoryEntity>
  ): Promise<ProductCategoryEntity | null> {
    return this.productCategoriesRepository.findOne({
      where: options,
    });
  }

  async create(dto: CreateProductCategoryDto): Promise<ProductCategoryEntity> {
    const foundExistsProductCategory = await this.findOne({ name: dto.name });

    if (foundExistsProductCategory)
      throw new BadRequestException(
        `The product category with ${dto.name} name already exists`
      );

    const newProductCategory = new ProductCategoryEntity();
    newProductCategory.name = dto.name;
    newProductCategory.image_url = dto.image_url;
    newProductCategory.display = dto.display;
    newProductCategory.display_position = dto.display_position;

    return this.productCategoriesRepository.save(newProductCategory);
  }

  async update(
    uuid: string,
    dto: UpdateProductCategoryDto
  ): Promise<ProductCategoryEntity> {
    const [foundProductCagegory, foundExistsProductCategory] =
      await Promise.all([
        this.findOne({ uuid }),
        this.findOne({ uuid: Not(uuid), name: dto.name }),
      ]);

    if (!foundProductCagegory)
      throw new NotFoundException(
        `The product category ${uuid} does not exist`
      );

    if (foundExistsProductCategory)
      throw new BadRequestException(
        `The product category with ${dto.name} name already exists`
      );

    foundProductCagegory.name = dto.name ?? foundProductCagegory.name;
    foundProductCagegory.image_url =
      dto.image_url ?? foundProductCagegory.image_url;
    foundProductCagegory.display =
      dto.display ?? foundProductCagegory.display;
    foundProductCagegory.display_position =
      dto.display_position ?? foundProductCagegory.display_position;

    return this.productCategoriesRepository.save(foundProductCagegory);
  }

  async delete(uuid: string): Promise<void> {
    const foundProductCategory = await this.findOne({ uuid });

    if (!foundProductCategory)
      throw new NotFoundException(
        `The product category ${uuid} does not exist`
      );

    await this.productCategoriesRepository.delete({ uuid });
  }
}
