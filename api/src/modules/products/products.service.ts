import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Repository } from "typeorm";
import ProductEntity from "~/db/entities/product.entity";
import ModifiersService from "../modifiers/modifiers.service";
import ProductCategoriesService from "./modules/categories/categories.service";
import { CreateProductDto, UpdateProductDto } from "./products.dto";

@Injectable()
export default class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    private readonly productCategoriesService: ProductCategoriesService,
    @Inject(forwardRef(() => ModifiersService))
    private readonly modifiersService: ModifiersService
  ) {}

  find(options?: FindOptionsWhere<ProductEntity>): Promise<ProductEntity[]> {
    return this.productsRepository
      .find({
        where: options,
        relations: { category: true, modifiers: true },
      })
      .then(products => ProductsService.sort(products));
  }

  static sort(products: ProductEntity[]) {
    return products.sort((a, b) => ProductEntity.compare(a, b));
  }

  findOne(
    options?: FindOptionsWhere<ProductEntity>
  ): Promise<ProductEntity | null> {
    return this.productsRepository.findOne({
      where: options,
      relations: { category: true, modifiers: true },
    });
  }

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    const [
      foundCategory,
      foundModifiers,
      foundExistsArticleProduct,
      foundExistsArticleModifier,
    ] = await Promise.all([
      this.productCategoriesService.findOne({
        uuid: dto.category_uuid,
      }),
      this.modifiersService.find({ uuid: In(dto.modifiers_uuids) }),
      this.findOne({ article_number: dto.article_number }),
      this.modifiersService.findOne({ article_number: dto.article_number }),
    ]);

    if (!foundCategory)
      throw new NotFoundException(
        `The category ${dto.category_uuid} does not exist`
      );

    if (foundModifiers.length !== dto.modifiers_uuids.length) {
      const foundModifiersSet = new Set(foundModifiers.map(m => m.uuid));

      for (const modifierUUID of dto.modifiers_uuids) {
        if (!foundModifiersSet.has(modifierUUID))
          throw new NotFoundException(
            `The modifier ${modifierUUID} does not exist`
          );
      }
    }

    foundModifiers.reduce<Record<string, boolean>>((acc, curr) => {
      if (Object.keys(acc).includes(curr.category_uuid))
        throw new BadRequestException(
          `The product must not have several modifiers the one ${curr.category?.name} category`
        );

      acc[curr.category_uuid] = true;
      return acc;
    }, {});

    if (foundExistsArticleProduct)
      throw new BadRequestException(
        `The product ${foundExistsArticleProduct.uuid} already has the article number`
      );

    if (foundExistsArticleModifier)
      throw new BadRequestException(
        `The modifier ${foundExistsArticleModifier.uuid} already has the article number`
      );

    const e = new ProductEntity();
    e.name = dto.name;
    e.desc = dto.desc;
    e.image_url = dto.image_url;
    e.article_number = dto.article_number;
    e.price = dto.price;
    e.category = foundCategory;
    e.modifiers = foundModifiers;

    return this.productsRepository.save(e);
  }

  async update(uuid: string, dto: UpdateProductDto): Promise<ProductEntity> {
    const foundProduct = await this.findOne({ uuid });

    if (!foundProduct)
      throw new NotFoundException(`The product ${uuid} does not exist`);

    if (dto.category_uuid && foundProduct.category_uuid !== dto.category_uuid) {
      const foundCategory = await this.productCategoriesService.findOne({
        uuid: dto.category_uuid,
      });

      if (!foundCategory)
        throw new NotFoundException(
          `The category ${dto.category_uuid} does not exist`
        );

      foundProduct.category_uuid = foundCategory.uuid;
    }

    if (dto.modifiers_uuids) {
      const foundModifiers = await this.modifiersService.find({
        uuid: In(dto.modifiers_uuids),
      });

      if (foundModifiers.length !== dto.modifiers_uuids.length) {
        const foundModifiersSet = new Set(foundModifiers.map(m => m.uuid));

        for (const modifierUUID of dto.modifiers_uuids) {
          if (!foundModifiersSet.has(modifierUUID))
            throw new NotFoundException(
              `The modifier ${modifierUUID} does not exist`
            );
        }
      }

      foundModifiers.reduce<Record<string, boolean>>((acc, curr) => {
        if (Object.keys(acc).includes(curr.category_uuid))
          throw new BadRequestException(
            `The product must not have several modifiers the one ${curr.category?.name} category`
          );

        acc[curr.category_uuid] = true;
        return acc;
      }, {});

      foundProduct.modifiers = foundModifiers;
    }

    if (
      dto.article_number &&
      dto.article_number !== foundProduct.article_number
    ) {
      const [foundExistsArticleProduct, foundExistsArticleModifier] =
        await Promise.all([
          this.findOne({ article_number: dto.article_number }),
          this.modifiersService.findOne({ article_number: dto.article_number }),
        ]);

      if (foundExistsArticleProduct)
        throw new BadRequestException(
          `The product ${foundExistsArticleProduct.uuid} already has the article number`
        );

      if (foundExistsArticleModifier)
        throw new BadRequestException(
          `The modifier ${foundExistsArticleModifier.uuid} already has the article number`
        );

      foundProduct.article_number = dto.article_number;
    }

    foundProduct.name = dto.name || foundProduct.name;
    foundProduct.desc = dto.desc || foundProduct.desc;
    foundProduct.image_url = dto.image_url || foundProduct.image_url;
    foundProduct.price = dto.price || foundProduct.price;

    return this.productsRepository.save(foundProduct);
  }

  async delete(uuid: string): Promise<void> {
    const foundProduct = await this.findOne({ uuid });

    if (!foundProduct)
      throw new NotFoundException(`The product ${uuid} does not exist`);

    await this.productsRepository.delete({ uuid });
  }
}
