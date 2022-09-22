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
    options?: FindOptionsWhere<ModifierCategoryEntity>
  ): Promise<ModifierCategoryEntity[]> {
    return this.modifierCategoriesRespository
      .find({
        where: options,
      })
      .then(categories => ModifierCategoriesService.sort(categories));
  }

  static sort(categories: ModifierCategoryEntity[]): ModifierCategoryEntity[] {
    return categories.sort((a, b) => ModifierCategoryEntity.compare(a, b));
  }

  findOne(
    options?: FindOptionsWhere<ModifierCategoryEntity>
  ): Promise<ModifierCategoryEntity | null> {
    return this.modifierCategoriesRespository.findOne({
      where: options,
    });
  }

  async create(
    dto: CreateModifierCategoryDto
  ): Promise<ModifierCategoryEntity> {
    const [foundModifierCategoryName, foundModifierCategoryDisplayName] =
      await Promise.all([
        this.findOne({ name: dto.name }),
        this.findOne({ display_name: dto.display_name }),
      ]);

    if (foundModifierCategoryName)
      throw new BadRequestException(
        `The modifier category with '${dto.name}' name already exists`
      );

    if (foundModifierCategoryDisplayName)
      throw new BadRequestException(
        `The modifier category with '${dto.display_name}' display name already exists`
      );

    const newModifierCategory = new ModifierCategoryEntity();
    newModifierCategory.name = dto.name;
    newModifierCategory.image_url = dto.image_url;
    newModifierCategory.choice_option = dto.choice_option;
    newModifierCategory.display = dto.display;
    newModifierCategory.display_name = dto.display_name;
    newModifierCategory.display_variant = dto.display_variant;
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

    if (dto.name && foundModifierCategory.name !== dto.name) {
      const foundModifierCategoryName = await this.findOne({ name: dto.name });

      if (foundModifierCategoryName)
        throw new BadRequestException(
          `The modifier category with '${dto.name}' name already exists`
        );

      foundModifierCategory.name = dto.name;
    }

    if (
      dto.display_name &&
      foundModifierCategory.display_name !== dto.display_name
    ) {
      const foundModifierCategoryDisplayName = await this.findOne({
        display_name: dto.display_name,
      });

      if (foundModifierCategoryDisplayName)
        throw new BadRequestException(
          `The modifier category with '${dto.display_name}' display name already exists`
        );

      foundModifierCategory.display_name = dto.display_name;
    }

    foundModifierCategory.image_url =
      dto.image_url ?? foundModifierCategory.image_url;
    foundModifierCategory.choice_option =
      dto.choice_option ?? foundModifierCategory.choice_option;
    foundModifierCategory.display =
      dto.display ?? foundModifierCategory.display;
    foundModifierCategory.display_variant =
      dto.display_variant ?? foundModifierCategory.display_variant;
    foundModifierCategory.display_position =
      dto.display_position ?? foundModifierCategory.display_position;

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
