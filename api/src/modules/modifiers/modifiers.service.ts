import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Not, Repository } from "typeorm";
import ModifierEntity from "~/db/entities/modifier.entity";
import { CreateModifierDto, UpdateModifierDto } from "./modifiers.dto";
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
    const [foundModifierCategory, foundModifier] = await Promise.all([
      this.modifierCategoriesService.findOne({
        uuid: dto.category_uuid,
      }),
      this.findOne({ name: dto.name, category_uuid: dto.category_uuid }),
    ]);

    if (!foundModifierCategory)
      throw new NotFoundException(
        `The modifier category ${dto.category_uuid} does not exist`
      );

    if (foundModifier)
      throw new BadRequestException(
        `The modifier with ${dto.name} name in ${foundModifierCategory.name} category already exists`
      );

    const newModifier = new ModifierEntity();
    newModifier.name = dto.name;
    newModifier.desc = dto.desc;
    newModifier.image_url = dto.image_url;
    newModifier.article_number = dto.article_number;
    newModifier.category_uuid = dto.category_uuid;
    newModifier.display_position = dto.display_position;
    newModifier.price = dto.price;

    return this.modifiersRepository.save(newModifier);
  }

  async update(uuid: string, dto: UpdateModifierDto): Promise<ModifierEntity> {
    const [foundModifierCategory, foundExistsModifier, foundModifier] =
      await Promise.all([
        this.modifierCategoriesService.findOne({
          uuid: dto.category_uuid,
        }),
        this.findOne({
          uuid: Not(uuid),
          name: dto.name,
          category_uuid: dto.category_uuid,
        }),
        this.findOne({
          uuid: uuid,
        }),
      ]);

    if (dto.category_uuid && !foundModifierCategory)
      throw new NotFoundException(
        `The modifier category ${dto.category_uuid} does not exist`
      );

    if (dto.name && dto.category_uuid && foundExistsModifier)
      throw new BadRequestException(
        `The modifier with ${dto.name} name in ${foundModifierCategory?.name} category already exists`
      );

    if (!foundModifier)
      throw new NotFoundException(`The modifier ${uuid} does not exist`);

    foundModifier.name = dto.name || foundModifier.name;
    foundModifier.desc = dto.desc || foundModifier.desc;
    foundModifier.image_url = dto.image_url || foundModifier.desc;
    foundModifier.article_number =
      dto.article_number || foundModifier.article_number;
    foundModifier.category_uuid =
      dto.category_uuid || foundModifier.category_uuid;
    foundModifier.display_position =
      dto.display_position || foundModifier.display_position;
    foundModifier.price = dto.price || foundModifier.price;

    return this.modifiersRepository.save(foundModifier);
  }

  async delete(uuid: string): Promise<void> {
    const foundModifier = await this.findOne({ uuid });

    if (!foundModifier)
      throw new NotFoundException(`The modifier ${uuid} does not exist`);

    await this.modifiersRepository.delete({ uuid });
  }
}
