import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Not, Repository } from "typeorm";
import ModifierEntity from "~/db/entities/modifier.entity";
import ProductsService from "../products/products.service";
import { CreateModifierDto, UpdateModifierDto } from "./modifiers.dto";
import ModifierCategoriesService from "./modules/categories/categories.service";

@Injectable()
export default class ModifiersService {
  constructor(
    @InjectRepository(ModifierEntity)
    private readonly modifiersRepository: Repository<ModifierEntity>,
    private readonly modifierCategoriesService: ModifierCategoriesService,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService
  ) {}

  find(options?: FindOptionsWhere<ModifierEntity>): Promise<ModifierEntity[]> {
    return this.modifiersRepository
      .find({
        where: options,
        relations: { category: true },
      })
      .then(modifiers => this.order(modifiers));
  }

  private order(modifiers: ModifierEntity[]) {
    return modifiers.sort((a, b) => {
      if (!a.category?.display_position && b.category?.display_position)
        return 1;
      else if (a.category?.display_position && !b.category?.display_position)
        return -1;
      else if (a.category?.display_position && b.category?.display_position) {
        if (a.category?.display_position < b.category?.display_position)
          return -1;
        else if (a.category?.display_position > b.category?.display_position)
          return 1;
      } else if (!a.display_position && b.display_position) return 1;
      else if (a.display_position && !b.display_position) return -1;
      else if (!a.display_position || !b.display_position) return 0;
      else if (a.display_position < b.display_position) return -1;
      else if (a.display_position > b.display_position) return 1;
      return 0;
    });
  }

  findOne(
    options?: FindOptionsWhere<ModifierEntity>
  ): Promise<ModifierEntity | null> {
    return this.modifiersRepository.findOne({
      where: options,
      relations: { category: true },
    });
  }

  async create(dto: CreateModifierDto): Promise<ModifierEntity> {
    const [
      foundModifierCategory,
      foundExistsModifier,
      foundExistsArticleProduct,
      foundExistsArticleModifier,
    ] = await Promise.all([
      this.modifierCategoriesService.findOne({
        uuid: dto.category_uuid,
      }),
      this.findOne({ name: dto.name, category_uuid: dto.category_uuid }),
      this.productsService.findOne({ article_number: dto.article_number }),
      this.findOne({ article_number: dto.article_number }),
    ]);

    if (!foundModifierCategory)
      throw new NotFoundException(
        `The modifier category ${dto.category_uuid} does not exist`
      );

    if (foundExistsModifier)
      throw new BadRequestException(
        `The modifier with ${dto.name} name in ${foundModifierCategory.name} category already exists`
      );

    if (foundExistsArticleProduct)
      throw new BadRequestException(
        `The product ${foundExistsArticleProduct.uuid} already has the article number`
      );

    if (foundExistsArticleModifier)
      throw new BadRequestException(
        `The modifier ${foundExistsArticleModifier.uuid} already has the article number`
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
    const foundModifier = await this.findOne({
      uuid,
    });

    if (!foundModifier)
      throw new NotFoundException(`The modifier ${uuid} does not exist`);

    if (dto.category_uuid) {
      const foundModifierCategory =
        await this.modifierCategoriesService.findOne({
          uuid: dto.category_uuid,
        });

      if (!foundModifierCategory)
        throw new NotFoundException(
          `The modifier category ${dto.category_uuid} does not exist`
        );

      foundModifier.category_uuid = dto.category_uuid;

      if (dto.name) {
        const foundExistsModifier = await this.findOne({
          uuid: Not(uuid),
          name: dto.name,
          category_uuid: dto.category_uuid,
        });

        if (foundExistsModifier)
          throw new BadRequestException(
            `The modifier with ${dto.name} name in ${foundModifierCategory.name} category already exists`
          );
      }
    }

    if (
      dto.article_number &&
      dto.article_number !== foundModifier.article_number
    ) {
      const [foundExistsArticleProduct, foundExistsArticleModifier] =
        await Promise.all([
          this.productsService.findOne({ article_number: dto.article_number }),
          this.findOne({ article_number: dto.article_number }),
        ]);

      if (foundExistsArticleProduct)
        throw new BadRequestException(
          `The product ${foundExistsArticleProduct.uuid} already has the article number`
        );

      if (foundExistsArticleModifier)
        throw new BadRequestException(
          `The modifier ${foundExistsArticleModifier.uuid} already has the article number`
        );

      foundModifier.article_number = dto.article_number;
    }

    foundModifier.name = dto.name || foundModifier.name;
    foundModifier.desc = dto.desc || foundModifier.desc;
    foundModifier.image_url = dto.image_url || foundModifier.desc;
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
