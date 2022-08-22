import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Repository } from "typeorm";
import DiscountEntity, {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
} from "~/db/entities/discount.entity";
import ProductEntity from "~/db/entities/product.entity";
import ModifiersService from "../modifiers/modifiers.service";
import { Order } from "../orders/orders.dto";
import ProductCategoriesService from "../products/modules/categories/categories.service";
import ProductsService from "../products/products.service";
import { CreateDiscountDto, UpdateDiscountDto } from "./discounts.dto";
import { orderByProfitable } from "@monorepo/common/modules/discounts/order-by-profitable";
import { calculateDiscountValue } from "@monorepo/common/modules/discounts/calculate-discount-value";
import ModifierEntity from "~/db/entities/modifier.entity";
import { IOrderedProduct } from "@monorepo/common/modules/discounts/get-suitable-discount";

export type DiscountProduct = Omit<ProductEntity, "compare"> & {
  full_price: number;
  count: number;
};

@Injectable()
export default class DiscountsService {
  constructor(
    @InjectRepository(DiscountEntity)
    private readonly discountRepository: Repository<DiscountEntity>,
    private readonly productsService: ProductsService,
    private readonly productCategoriesService: ProductCategoriesService,
    private readonly modifiersService: ModifiersService
  ) {}

  find(options?: FindOptionsWhere<DiscountEntity>): Promise<DiscountEntity[]> {
    return this.discountRepository
      .find({
        where: options,
        relations: {
          products: true,
          product_categories: true,
          modifiers: true,
        },
      })
      .then(discounts => DiscountsService.sort(discounts));
  }

  findOne(
    options?: FindOptionsWhere<DiscountEntity>
  ): Promise<DiscountEntity | null> {
    return this.discountRepository.findOne({
      where: options,
      relations: {
        products: true,
        product_categories: true,
        modifiers: true,
      },
    });
  }

  static sort(discounts: DiscountEntity[]): DiscountEntity[] {
    return discounts.sort((a, b) => DiscountEntity.compare(a, b));
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
    e.scope = dto.scope;
    e.value = dto.value;

    if (dto.type === DiscountTypeEnum.FIXED_PRICE) {
      if (dto.scope === DiscountScopeEnum.GLOBAL)
        throw new BadRequestException(
          `The ${DiscountTypeEnum.FIXED_PRICE} discount type is not available with ${DiscountScopeEnum.GLOBAL} discount scope`
        );

      if (dto.condition?.criteria !== DiscountCriteriaEnum.COUNT)
        throw new BadRequestException(
          `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountCriteriaEnum.COUNT} discount criteria`
        );

      if (dto.condition?.op !== DiscountOperatorEnum.EQUAL)
        throw new BadRequestException(
          `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountOperatorEnum.EQUAL} discount operator`
        );
    }

    e.type = dto.type;

    if (dto.scope === DiscountScopeEnum.PRODUCTS) {
      if (dto.condition.criteria === DiscountCriteriaEnum.PRICE)
        throw new BadRequestException(
          `The ${DiscountCriteriaEnum.PRICE} discount criteria is not available with the ${DiscountScopeEnum.PRODUCTS} discount scope`
        );

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

    if (dto.scope === DiscountScopeEnum.PRODUCT_FEATURES) {
      const [productCategories, modifiers] = await Promise.all([
        this.productCategoriesService.find({
          uuid: In(dto.product_categories_uuids),
        }),
        this.modifiersService.find({ uuid: In(dto.modifiers_uuids) }),
      ]);

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

      if (modifiers.length !== dto.modifiers_uuids.length) {
        const modifiersSet = new Set(modifiers.map(p => p.uuid));

        for (const modifierUUID of dto.modifiers_uuids) {
          if (!modifiersSet.has(modifierUUID)) {
            throw new NotFoundException(
              `The modifier ${modifierUUID} does not exist`
            );
          }
        }
      }

      e.product_categories = productCategories;
      e.modifiers = modifiers;
    }

    if (
      dto.condition.op === DiscountOperatorEnum.BETWEEN &&
      !dto.condition.value2
    )
      throw new BadRequestException(
        `The discount has the ${DiscountOperatorEnum.BETWEEN} condition operator, but the value2 was not provided`
      );

    e.condition = dto.condition;

    return this.discountRepository.save(e);
  }

  async update(uuid: string, dto: UpdateDiscountDto): Promise<DiscountEntity> {
    const foundDiscount = await this.findOne({ uuid });

    if (!foundDiscount)
      throw new NotFoundException(`The discount ${uuid} does not exist`);

    if (dto.name && dto.name !== foundDiscount.name) {
      const foundExistsDiscount = await this.findOne({
        name: dto.name,
      });

      if (foundExistsDiscount)
        throw new BadRequestException(
          `The discount ${foundExistsDiscount.uuid} already has the ${dto.name} name`
        );

      foundDiscount.name = dto.name;
    }

    if (
      (dto.type && dto.type === DiscountTypeEnum.PERCENT) ||
      (!dto.type && foundDiscount.type == DiscountTypeEnum.PERCENT)
    ) {
      if (
        (dto.value !== undefined && dto.value > 100) ||
        (dto.value === undefined && foundDiscount.value > 100)
      )
        throw new BadRequestException(
          `The discount cannot has the value greater then 100 when it has ${DiscountTypeEnum.PERCENT} type`
        );
    }

    if (
      dto.type === DiscountTypeEnum.FIXED_PRICE ||
      (!dto.type && foundDiscount.type === DiscountTypeEnum.FIXED_PRICE)
    ) {
      if (
        dto.scope === DiscountScopeEnum.GLOBAL ||
        (!dto.scope && foundDiscount.scope == DiscountScopeEnum.GLOBAL)
      )
        throw new BadRequestException(
          `The ${DiscountTypeEnum.FIXED_PRICE} discount type is not available with ${DiscountScopeEnum.GLOBAL} discount scope`
        );

      if (
        (dto.condition?.criteria &&
          dto.condition.criteria !== DiscountCriteriaEnum.COUNT) ||
        (dto.condition?.criteria === undefined &&
          foundDiscount.condition.criteria !== DiscountCriteriaEnum.COUNT)
      )
        throw new BadRequestException(
          `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountCriteriaEnum.COUNT} discount criteria`
        );

      if (
        (dto.condition?.op &&
          dto.condition.op !== DiscountOperatorEnum.EQUAL) ||
        (dto.condition?.op === undefined &&
          foundDiscount.condition.op !== DiscountOperatorEnum.EQUAL)
      )
        throw new BadRequestException(
          `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountOperatorEnum.EQUAL} discount operator`
        );
    }

    if (dto.scope === DiscountScopeEnum.PRODUCTS) {
      foundDiscount.modifiers = [];
      foundDiscount.product_categories = [];
    } else if (dto.scope === DiscountScopeEnum.PRODUCT_FEATURES) {
      foundDiscount.products = [];
    } else if (dto.scope === DiscountScopeEnum.GLOBAL) {
      foundDiscount.products = [];
      foundDiscount.product_categories = [];
      foundDiscount.modifiers = [];
    }

    if (dto.products_uuids?.length) {
      if (
        dto.scope !== DiscountScopeEnum.PRODUCTS &&
        foundDiscount.scope !== DiscountScopeEnum.PRODUCTS
      )
        throw new BadRequestException(
          `The discount cannot has the products beacuse of it has the ${foundDiscount.scope} scope`
        );

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
      foundDiscount.products = products;
    }

    if (dto.product_categories_uuids?.length) {
      if (
        dto.scope !== DiscountScopeEnum.PRODUCT_FEATURES &&
        foundDiscount.scope !== DiscountScopeEnum.PRODUCT_FEATURES
      )
        throw new BadRequestException(
          `The discount cannot has the product categories beacuse of it has the ${foundDiscount.scope} scope`
        );

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
      foundDiscount.product_categories = productCategories;
    }

    if (dto.modifiers_uuids?.length) {
      if (
        dto.scope !== DiscountScopeEnum.PRODUCT_FEATURES &&
        foundDiscount.scope !== DiscountScopeEnum.PRODUCT_FEATURES
      )
        throw new BadRequestException(
          `The discount cannot has the modifiers beacuse of it has the ${foundDiscount.scope} scope`
        );

      const modifiers = await this.modifiersService.find({
        uuid: In(dto.modifiers_uuids),
      });

      if (modifiers.length !== dto.modifiers_uuids.length) {
        const modifiersSet = new Set(modifiers.map(p => p.uuid));

        for (const modifierUUID of dto.modifiers_uuids) {
          if (!modifiersSet.has(modifierUUID)) {
            throw new NotFoundException(
              `The modifier ${modifierUUID} does not exist`
            );
          }
        }
      }
      foundDiscount.modifiers = modifiers;
    }

    if (
      (dto.scope === DiscountScopeEnum.PRODUCTS ||
        (!dto.scope && foundDiscount.scope === DiscountScopeEnum.PRODUCTS)) &&
      ((dto.condition &&
        dto.condition.criteria === DiscountCriteriaEnum.PRICE) ||
        (!dto.condition &&
          foundDiscount.condition.criteria === DiscountCriteriaEnum.PRICE))
    )
      throw new BadRequestException(
        `The ${DiscountCriteriaEnum.PRICE} discount criteria is not available with the ${DiscountScopeEnum.PRODUCTS} discount scope`
      );

    if (dto.condition) {
      if (
        dto.condition.op === DiscountOperatorEnum.BETWEEN &&
        !dto.condition.value2
      )
        throw new BadRequestException(
          `The discount has the ${DiscountOperatorEnum.BETWEEN} condition operator, but the value2 was not provided`
        );
    }

    foundDiscount.scope = dto.scope ?? foundDiscount.scope;
    foundDiscount.condition = dto.condition ?? foundDiscount.condition;
    foundDiscount.type = dto.type ?? foundDiscount.type;
    foundDiscount.value = dto.value ?? foundDiscount.value;

    return this.discountRepository.save(foundDiscount);
  }

  async delete(uuid: string): Promise<void> {
    const foundDiscount = await this.findOne({ uuid });

    if (!foundDiscount)
      throw new NotFoundException(`The discount ${uuid} does not exist`);

    await this.discountRepository.delete({ uuid });
  }

  async calculate(order: Order): Promise<number> {
    const [discounts, products, modifiers] = await Promise.all([
      this.find().then(discounts => orderByProfitable(discounts)),
      this.productsService
        .find({
          uuid: In(order.products.map(p => p.uuid)),
        })
        .then(products => new Map(products.map(p => [p.uuid, p]))),
      this.modifiersService
        .find({
          uuid: In(
            Array.from(
              order.products.reduce((modifiersUUIDs, product) => {
                product.modifiers.forEach(
                  m => !modifiersUUIDs.has(m.uuid) && modifiersUUIDs.add(m.uuid)
                );
                return modifiersUUIDs;
              }, new Set())
            )
          ),
        })
        .then(modifiers => new Map(modifiers.map(m => [m.uuid, m]))),
    ]);

    const orderedProducts: IOrderedProduct[] = order.products
      .map(p => {
        const product = products.get(p.uuid);

        if (!product)
          throw new NotFoundException(`The product ${p.uuid} does not exist`);

        return {
          ...product,
          count: p.count,
          fullPrice:
            product.price +
            p.modifiers.reduce((totalModifiersCost, orderedProductmodifier) => {
              const modifier = modifiers.get(orderedProductmodifier.uuid);

              if (!modifier)
                throw new NotFoundException(
                  `The modifier ${orderedProductmodifier.uuid} does not exist`
                );

              return totalModifiersCost + modifier.price;
            }, 0),
          modifiers: p.modifiers.map(
            modifier => modifiers.get(modifier.uuid) as ModifierEntity
          ),
        };
      })
      .sort((a, b) =>
        a.fullPrice - b.fullPrice === 0
          ? a.count - b.count
          : a.fullPrice - b.fullPrice
      );

    return calculateDiscountValue({
      discounts,
      products: orderedProducts,
    });
  }
}
