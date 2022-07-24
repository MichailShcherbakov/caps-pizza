import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import CategoryEntity from "~/db/entities/category.entity";
import { CreateCategoryDto } from "./categories.dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoriesRepository: Repository<CategoryEntity>
  ) {}

  find(
    options: FindOptionsWhere<CategoryEntity> = {}
  ): Promise<CategoryEntity[]> {
    return this.categoriesRepository.find({ where: options });
  }

  findOne(
    options: FindOptionsWhere<CategoryEntity> = {}
  ): Promise<CategoryEntity | null> {
    return this.categoriesRepository.findOne({ where: options });
  }

  create(options: CreateCategoryDto): Promise<CategoryEntity> {
    const newCategory = new CategoryEntity();
    newCategory.name = options.name;
    newCategory.image_url = options.image_url;

    return this.categoriesRepository.save(newCategory);
  }

  async delete(uuid: string): Promise<void> {
    const foundCategory = await this.findOne({ uuid });

    if (!foundCategory)
      throw new NotFoundException("The category " + uuid + " does not exist");

    await this.categoriesRepository.delete({ uuid });
  }
}

export default CategoriesService;
