import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import ModifierCategoryEntity from "~/db/entities/modifier-category.entity";
import { CreateModifierCategoryDto } from "./categories.dto";

@Injectable()
export default class ModifierCategoriesService {
  constructor(
    @InjectRepository(ModifierCategoryEntity)
    private readonly modifierCategoriesRespository: Repository<ModifierCategoryEntity>
  ) {}

  find(
    options: FindOptionsWhere<ModifierCategoryEntity> = {}
  ): Promise<ModifierCategoryEntity[]> {
    return this.modifierCategoriesRespository.find({
      where: options,
    });
  }

  findOne(
    options: FindOptionsWhere<ModifierCategoryEntity> = {}
  ): Promise<ModifierCategoryEntity | null> {
    return this.modifierCategoriesRespository.findOne({ where: options });
  }

  create(dto: CreateModifierCategoryDto): Promise<ModifierCategoryEntity> {
    const newModifierCategory = new ModifierCategoryEntity();
    newModifierCategory.name = dto.name;
    newModifierCategory.image_url = dto.image_url;

    return this.modifierCategoriesRespository.save(newModifierCategory);
  }

  async delete(uuid: string): Promise<void> {
    const foundModifierCategory = await this.findOne({ uuid });

    if (!foundModifierCategory)
      throw new NotFoundException(
        `The modifier category ${uuid} does not exist`
      );

    await this.modifierCategoriesRespository.delete({ uuid });
  }
}
