import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Repository } from "typeorm";
import DiscountEntity, {
  DiscountScopeEnum,
  DiscountTypeEnum,
} from "~/db/entities/discount.entity";
import ProductCategoriesService from "../products/modules/categories/categories.service";
import ProductsService from "../products/products.service";
import { CreateDiscountDto } from "./discounts.dto";

@Injectable()
export default class DiscountsService {
  constructor(
    @InjectRepository(DiscountEntity)
    private readonly discountRepository: Repository<DiscountEntity>,
    private readonly productsService: ProductsService,
    private readonly productCategoriesService: ProductCategoriesService
  ) {}

  find(
    options: FindOptionsWhere<DiscountEntity> = {}
  ): Promise<DiscountEntity[]> {
    return this.discountRepository.find({
      where: options,
      relations: {
        products: true,
        product_categories: true,
      },
      order: {
        name: "ASC",
      },
    });
  }

  findOne(
    options: FindOptionsWhere<DiscountEntity> = {}
  ): Promise<DiscountEntity | null> {
    return this.discountRepository.findOne({
      where: options,
      relations: {
        products: true,
        product_categories: true,
      },
    });
  }

  async create(dto: CreateDiscountDto): Promise<DiscountEntity> {
    const foundDiscount = await this.findOne({ name: dto.name });

    if (foundDiscount)
      throw new BadRequestException(
        `The discount ${foundDiscount.uuid} already has the ${dto.name} name`
      );

    if (dto.type === DiscountTypeEnum.PERCENT && dto.value > 100)
      throw new BadRequestException(
        `The discount cannot has the value greater then 100 when it has ${DiscountTypeEnum.PERCENT} type`
      );

    const e = new DiscountEntity();
    e.name = dto.name;
    e.type = dto.type;
    e.scope = dto.scope;
    e.condition = dto.condition;
    e.value = dto.value;

    if (dto.scope === DiscountScopeEnum.PRODUCTS) {
      const products = await this.productsService.find({
        uuid: In(dto.products_uuids),
      });

      if (products.length !== dto.products_uuids.length) {
        const productsSet = new Set(products.map(p => p.uuid));

        for (const productUUID of dto.products_uuids) {
          if (!productsSet.has(productUUID)) {
            throw new NotFoundException(
              `The product ${productUUID} does not exist`
            );
          }
        }
      }

      e.products = products;
    }

    if (dto.scope === DiscountScopeEnum.PRODUCT_CATEGORIES) {
      const productCategories = await this.productCategoriesService.find({
        uuid: In(dto.product_categories_uuids),
      });

      if (productCategories.length !== dto.product_categories_uuids.length) {
        const productCategoriesSet = new Set(
          productCategories.map(p => p.uuid)
        );

        for (const productCategoryUUID of dto.product_categories_uuids) {
          if (!productCategoriesSet.has(productCategoryUUID)) {
            throw new NotFoundException(
              `The product category ${productCategoryUUID} does not exist`
            );
          }
        }
      }

      e.product_categories = productCategories;
    }

    return this.discountRepository.save(e);
  }

  async delete(uuid: string): Promise<void> {
    const foundDiscount = await this.findOne({ uuid });

    if (!foundDiscount)
      throw new NotFoundException(`The discount ${uuid} does not exist`);

    await this.discountRepository.delete({ uuid });
  }
}
