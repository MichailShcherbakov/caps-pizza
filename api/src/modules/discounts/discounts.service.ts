import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Not, Repository } from "typeorm";
import DiscountEntity, {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
} from "~/db/entities/discount.entity";
import ModifiersService from "../modifiers/modifiers.service";
import { Order, OrderedProduct } from "../orders/orders.dto";
import ProductCategoriesService from "../products/modules/categories/categories.service";
import ProductsService from "../products/products.service";
import { CreateDiscountDto, UpdateDiscountDto } from "./discounts.dto";

@Injectable()
export default class DiscountsService {
  constructor(
    @InjectRepository(DiscountEntity)
    private readonly discountRepository: Repository<DiscountEntity>,
    private readonly productsService: ProductsService,
    private readonly productCategoriesService: ProductCategoriesService,
    private readonly modifiersService: ModifiersService
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
        created_at: "ASC",
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

  async update(uuid: string, dto: UpdateDiscountDto): Promise<DiscountEntity> {
    const foundDiscount = await this.findOne({ uuid });

    if (!foundDiscount)
      throw new NotFoundException(`The discount ${uuid} does not exist`);

    if (dto.name) {
      const foundExistsDiscount = await this.findOne({
        uuid: Not(uuid),
        name: dto.name,
      });

      if (foundExistsDiscount)
        throw new BadRequestException(
          `The discount ${foundExistsDiscount.uuid} already has the ${dto.name} name`
        );

      foundDiscount.name = dto.name;
    }

    if (dto.type) {
      if (dto.type === DiscountTypeEnum.PERCENT)
        if (
          (dto.value !== undefined && dto.value > 100) ||
          (dto.value === undefined && foundDiscount.value > 100)
        )
          throw new BadRequestException(
            `The discount cannot has the value greater then 100 when it has ${DiscountTypeEnum.PERCENT} type`
          );

      foundDiscount.type = dto.type;
    }

    if (dto.scope) {
      if (dto.scope === DiscountScopeEnum.PRODUCTS) {
        foundDiscount.product_categories = [];
      } else if (dto.scope === DiscountScopeEnum.PRODUCT_CATEGORIES) {
        foundDiscount.products = [];
      } else {
        foundDiscount.products = [];
        foundDiscount.product_categories = [];
      }

      foundDiscount.scope = dto.scope;
    }

    if (dto.products_uuids) {
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

    if (dto.product_categories_uuids) {
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

    foundDiscount.condition = dto.condition || foundDiscount.condition;
    foundDiscount.value = dto.value || foundDiscount.value;

    return this.discountRepository.save(foundDiscount);
  }

  async delete(uuid: string): Promise<void> {
    const foundDiscount = await this.findOne({ uuid });

    if (!foundDiscount)
      throw new NotFoundException(`The discount ${uuid} does not exist`);

    await this.discountRepository.delete({ uuid });
  }

  orderByScope(discounts: DiscountEntity[]): DiscountEntity[] {
    return discounts.sort((a, b) => {
      switch (a.scope) {
        case DiscountScopeEnum.PRODUCTS: {
          if (b.scope !== DiscountScopeEnum.PRODUCTS) return -1;
          return 0;
        }
        case DiscountScopeEnum.PRODUCT_CATEGORIES: {
          if (b.scope === DiscountScopeEnum.PRODUCTS) return 1;
          else if (b.scope === DiscountScopeEnum.GLOBAL) return -1;
          return 0;
        }
        case DiscountScopeEnum.GLOBAL: {
          if (b.scope === DiscountScopeEnum.GLOBAL) return 0;
          return 1;
        }
        default: {
          return 0;
        }
      }
    });
  }

  isFulfilledCondition(discount: DiscountEntity, value: number): boolean {
    switch (discount.condition.op) {
      case DiscountOperatorEnum.EQUAL: {
        return Math.floor(value / discount.condition.value) > 0;
      }
      case DiscountOperatorEnum.GREATER: {
        return value > discount.condition.value;
      }
      case DiscountOperatorEnum.LESS: {
        return value < discount.condition.value;
      }
      case DiscountOperatorEnum.NOT_EQUAL: {
        return value !== discount.condition.value;
      }
      case DiscountOperatorEnum.BETWEEN: {
        return (
          discount.condition.value2 !== undefined &&
          value >
            Math.min(discount.condition.value, discount.condition.value2) &&
          value < Math.max(discount.condition.value, discount.condition.value2)
        );
      }
      default: {
        return false;
      }
    }
  }

  async calculate(
    order: Order
  ): Promise<{ type: DiscountTypeEnum; value: number } | null> {
    const [discounts, products, modifiers] = await Promise.all([
      this.find().then(discounts => this.orderByScope(discounts)),
      this.productsService
        .find({
          uuid: In(order.products.map(p => p.uuid)),
        })
        .then(products => new Map(products.map(p => [p.uuid, p]))),
      this.modifiersService
        .find({
          uuid: In([
            order.products.reduce((modifiersUUIDs, product) => {
              product.modifiers.forEach(
                m => !modifiersUUIDs.has(m.uuid) && modifiersUUIDs.add(m.uuid)
              );
              return modifiersUUIDs;
            }, new Set()),
          ]),
        })
        .then(modifiers => new Map(modifiers.map(m => [m.uuid, m]))),
    ]);

    const orderedProducts = order.products
      .map(p => {
        const product = products.get(p.uuid);

        if (!product)
          throw new NotFoundException(`The product ${p.uuid} does not exist`);

        return {
          ...product,
          count: p.count,
          full_priсe:
            product.price +
            p.modifiers.reduce((totalModifiersCost, orderedProductmodifier) => {
              const modifier = modifiers.get(orderedProductmodifier.uuid);

              if (!modifier)
                throw new NotFoundException(
                  `The modifier ${orderedProductmodifier.uuid} does not exist`
                );

              return totalModifiersCost + modifier.price;
            }, 0),
        };
      })
      .sort((a, b) =>
        a.price - b.price === 0 ? a.count - b.count : a.price - b.price
      );

    const totalOrderCost = orderedProducts.reduce(
      (cost, p) => cost + p.full_priсe * p.count,
      0
    );

    for (const discount of discounts) {
      switch (discount.scope) {
        case DiscountScopeEnum.PRODUCT_CATEGORIES: {
          const discountProductCategoriesUUIDs = new Set(
            discount.product_categories.map(c => c.uuid)
          );

          const filteredOrderedProducts = orderedProducts.filter(p =>
            discountProductCategoriesUUIDs.has(p.category_uuid)
          );

          if (discount.condition.criteria === DiscountCriteriaEnum.PRICE)
            return null;

          const totalOrderedProductsCount = filteredOrderedProducts.reduce(
            (count, p) => count + p.count,
            0
          );

          if (!this.isFulfilledCondition(discount, totalOrderedProductsCount))
            continue;

          if (discount.type === DiscountTypeEnum.FIXED_PRICE) {
            let discountPrice = totalOrderCost;
            let productCount = totalOrderedProductsCount;

            if (discount.condition.op === DiscountOperatorEnum.EQUAL)
              productCount =
                productCount - (productCount % discount.condition.value);

            for (const product of filteredOrderedProducts) {
              for (
                let i = 0;
                i < product.count && productCount > 0;
                ++i, --productCount
              )
                discountPrice -= product.full_priсe;
            }

            return {
              type: DiscountTypeEnum.IN_CASH,
              value:
                totalOrderCost -
                discountPrice -
                Math.floor(
                  totalOrderedProductsCount / discount.condition.value
                ) *
                  discount.value,
            };
          }

          /*

          const discountsCount =
            discount.condition.op === DiscountOperatorEnum.EQUAL
              ? Math.floor(suitableProductsCount / discount.condition.value)
              : 1;

          if (discount.type === DiscountTypeEnum.IN_CASH)
            return {
              type: DiscountTypeEnum.IN_CASH,
              value: discountsCount * discount.value,
            };
          else if (discount.type === DiscountTypeEnum.PERCENT) {
            return {
              type: DiscountTypeEnum.PERCENT,
              value: discount.value,
            };
          } else if (discount.type === DiscountTypeEnum.FIXED_PRICE) {
            suitableProductsCount; ///
            return {
              type: DiscountTypeEnum.IN_CASH,
              value: totalCostOrder - discountsCount * discount.value,
            };
          } */
        }
      }
    }

    return null;
  }
}
