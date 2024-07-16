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
        relations: { parent: true },
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
      relations: { parent: true },
    });
  }

  async create(dto: CreateProductCategoryDto): Promise<ProductCategoryEntity> {
    const [foundExistsProductCategory, foundParentProductCategory] =
      await Promise.all([
        this.findOne({ name: dto.name }),
        dto.parent_uuid && this.findOne({ uuid: dto.parent_uuid }),
      ]);

    if (foundExistsProductCategory)
      throw new BadRequestException(
        `The product category with ${dto.name} name already exists`
      );

    if (dto.parent_uuid && !foundParentProductCategory)
      throw new BadRequestException(
        `The ${dto.parent_uuid} parent product category not found`
      );

    const newProductCategory = new ProductCategoryEntity();
    newProductCategory.name = dto.name;
    newProductCategory.image_url = dto.image_url;
    newProductCategory.display = dto.display;
    newProductCategory.display_position = dto.display_position;
    newProductCategory.parent_uuid = dto.parent_uuid;
    newProductCategory.parent = foundParentProductCategory || undefined;

    return this.productCategoriesRepository.save(newProductCategory);
  }

  async update(
    uuid: string,
    dto: UpdateProductCategoryDto
  ): Promise<ProductCategoryEntity> {
    const [
      foundProductCategory,
      foundExistsProductCategory,
      foundParentProductCategory,
    ] = await Promise.all([
      this.findOne({ uuid }),
      this.findOne({ uuid: Not(uuid), name: dto.name }),
      dto.parent_uuid && this.findOne({ uuid: dto.parent_uuid }),
    ]);

    if (!foundProductCategory)
      throw new NotFoundException(
        `The product category ${uuid} does not exist`
      );

    if (foundExistsProductCategory)
      throw new BadRequestException(
        `The product category with ${dto.name} name already exists`
      );

    if (dto.parent_uuid && !foundParentProductCategory)
      throw new BadRequestException(
        `The parent product category ${dto.parent_uuid} does not exist`
      );

    foundProductCategory.name = dto.name ?? foundProductCategory.name;
    foundProductCategory.image_url =
      dto.image_url ?? foundProductCategory.image_url;
    foundProductCategory.display = dto.display ?? foundProductCategory.display;
    foundProductCategory.display_position =
      dto.display_position ?? foundProductCategory.display_position;
    foundProductCategory.parent_uuid =
      dto.parent_uuid ?? foundProductCategory.parent_uuid;

    return this.productCategoriesRepository.save(foundProductCategory);
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
