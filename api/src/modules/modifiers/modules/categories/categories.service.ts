import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import ModifierCategoryEntity from "~/db/entities/modifier-category.entity";
import {
  CreateModifierCategoryDto,
  UpdateModifierCategoryDto,
} from "./categories.dto";

@Injectable()
export default class ModifierCategoriesService {
  constructor(
    @InjectRepository(ModifierCategoryEntity)
    private readonly modifierCategoriesRespository: Repository<ModifierCategoryEntity>
  ) {}

  find(
    options: FindOptionsWhere<ModifierCategoryEntity> = {}
  ): Promise<ModifierCategoryEntity[]> {
    return this.modifierCategoriesRespository
      .find({
        where: options,
      })
      .then(categories => this.order(categories));
  }

  private order(
    categories: ModifierCategoryEntity[]
  ): ModifierCategoryEntity[] {
    return categories.sort((a, b) => {
      if (!a.display_position || !b.display_position) return 0;
      else if (a.display_position < b.display_position) return -1;
      else if (a.display_position > b.display_position) return 1;
      return 0;
    });
  }

  findOne(
    options: FindOptionsWhere<ModifierCategoryEntity> = {}
  ): Promise<ModifierCategoryEntity | null> {
    return this.modifierCategoriesRespository.findOne({
      where: options,
    });
  }

  async create(
    dto: CreateModifierCategoryDto
  ): Promise<ModifierCategoryEntity> {
    const foundModifierCategory = await this.findOne({ name: dto.name });

    if (foundModifierCategory)
      throw new BadRequestException(
        `The modifier category with '${dto.name}' name already exists`
      );

    const newModifierCategory = new ModifierCategoryEntity();
    newModifierCategory.name = dto.name;
    newModifierCategory.image_url = dto.image_url;
    newModifierCategory.display_position = dto.display_position;

    return this.modifierCategoriesRespository.save(newModifierCategory);
  }

  async update(
    uuid: string,
    dto: UpdateModifierCategoryDto
  ): Promise<ModifierCategoryEntity> {
    const foundModifierCategory = await this.findOne({ uuid });

    if (!foundModifierCategory)
      throw new NotFoundException(
        `The modifier category ${uuid} does not exist`
      );

    foundModifierCategory.name = dto.name || foundModifierCategory.name;
    foundModifierCategory.image_url =
      dto.image_url || foundModifierCategory.image_url;
    foundModifierCategory.display_position =
      dto.display_position || foundModifierCategory.display_position;

    return this.modifierCategoriesRespository.save(foundModifierCategory);
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
