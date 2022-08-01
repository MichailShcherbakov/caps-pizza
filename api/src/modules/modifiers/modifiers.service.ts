import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import ModifierEntity from "~/db/entities/modifier.entity";
import { CreateModifierDto } from "./modifiers.dto";
import ModifierCategoriesService from "./modules/categories/categories.service";

@Injectable()
export default class ModifiersService {
  constructor(
    @InjectRepository(ModifierEntity)
    private readonly modifiersRepository: Repository<ModifierEntity>,
    private readonly modifierCategoriesService: ModifierCategoriesService
  ) {}

  find(
    options: FindOptionsWhere<ModifierEntity> = {}
  ): Promise<ModifierEntity[]> {
    return this.modifiersRepository.find({ where: options });
  }

  findOne(
    options: FindOptionsWhere<ModifierEntity> = {}
  ): Promise<ModifierEntity | null> {
    return this.modifiersRepository.findOne({ where: options });
  }

  async create(dto: CreateModifierDto): Promise<ModifierEntity> {
    const foundProductCategory = await this.modifierCategoriesService.findOne({
      uuid: dto.category_uuid,
    });

    if (!foundProductCategory)
      throw new NotFoundException(
        `The modifier category ${dto.category_uuid} does not exist`
      );

    const newModifier = new ModifierEntity();
    newModifier.name = dto.name;
    newModifier.desc = dto.desc;
    newModifier.image_url = dto.image_url;
    newModifier.article_number = dto.article_number;
    newModifier.category_uuid = dto.category_uuid;
    newModifier.price = dto.price;

    return this.modifiersRepository.save(newModifier);
  }

  async delete(uuid: string): Promise<void> {
    const foundModifier = await this.findOne({ uuid });

    if (!foundModifier)
      throw new NotFoundException(`The modifier ${uuid} does not exist`);

    await this.modifiersRepository.delete({ uuid });
  }
}
