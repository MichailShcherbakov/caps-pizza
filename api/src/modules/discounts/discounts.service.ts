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
      dto.type === DiscountTypeEnum.PERCENT ||
      (dto.type === undefined && foundDiscount.type == DiscountTypeEnum.PERCENT)
    ) {
      if (
        (dto.value !== undefined && dto.value > 100) ||
        (dto.value === undefined && foundDiscount.value > 100)
      )
        throw new BadRequestException(
          `The discount cannot has the value greater then 100 when it has ${DiscountTypeEnum.PERCENT} type`
        );

      foundDiscount.type = dto.type ?? foundDiscount.type;
    }

    if (
      dto.type === DiscountTypeEnum.FIXED_PRICE ||
      (dto.type === undefined &&
        foundDiscount.type === DiscountTypeEnum.FIXED_PRICE)
    ) {
      if (
        dto.scope === DiscountScopeEnum.GLOBAL ||
        (dto.scope === undefined &&
          foundDiscount.scope == DiscountScopeEnum.GLOBAL)
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

    if (dto.scope) {
      if (dto.scope === DiscountScopeEnum.PRODUCTS) {
        foundDiscount.modifiers = [];
        foundDiscount.product_categories = [];
      } else if (dto.scope === DiscountScopeEnum.PRODUCT_FEATURES) {
        foundDiscount.products = [];
      } else {
        foundDiscount.products = [];
        foundDiscount.product_categories = [];
        foundDiscount.modifiers = [];
      }

      foundDiscount.scope = dto.scope;
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
      dto.scope === DiscountScopeEnum.PRODUCTS ||
      (dto.scope === undefined &&
        foundDiscount.scope === DiscountScopeEnum.PRODUCTS &&
        (dto.condition?.criteria === DiscountCriteriaEnum.PRICE ||
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

      foundDiscount.condition = dto.condition || foundDiscount.condition;
    }

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
        case DiscountScopeEnum.PRODUCT_FEATURES: {
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

  isFulfilledCondition(
    discount: DiscountEntity,
    value: number,
    strict = false
  ): boolean {
    switch (discount.condition.op) {
      case DiscountOperatorEnum.EQUAL: {
        if (strict) return value === discount.condition.value;

        return Boolean(Math.floor(value / discount.condition.value));
      }
      case DiscountOperatorEnum.GREATER: {
        return value > discount.condition.value;
      }
      case DiscountOperatorEnum.LESS: {
        return value < discount.condition.value;
      }
      case DiscountOperatorEnum.BETWEEN: {
        return (
          discount.condition.value2 !== undefined &&
          value >=
            Math.min(discount.condition.value, discount.condition.value2) &&
          value <= Math.max(discount.condition.value, discount.condition.value2)
        );
      }
      default: {
        return false;
      }
    }
  }

  async calculate(order: Order): Promise<number> {
    const [discounts, products, modifiers] = await Promise.all([
      this.find().then(discounts => this.orderByScope(discounts)),
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

    const orderedProducts = order.products
      .map(p => {
        const product = products.get(p.uuid);

        if (!product)
          throw new NotFoundException(`The product ${p.uuid} does not exist`);

        return {
          ...product,
          count: p.count,
          full_price:
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
        a.full_price - b.full_price === 0
          ? a.count - b.count
          : a.full_price - b.full_price
      );

    const totalOrderCost = orderedProducts.reduce(
      (cost, p) => cost + p.full_price * p.count,
      0
    );

    for (const discount of discounts) {
      let validatedProducts: DiscountProduct[] = [];

      switch (discount.scope) {
        case DiscountScopeEnum.PRODUCTS: {
          if (discount.condition.criteria === DiscountCriteriaEnum.PRICE)
            throw new Error("The invalid discount");

          const discountProductsUUIDs = new Set(
            discount.products.map(p => p.uuid)
          );

          validatedProducts = orderedProducts.filter(p =>
            discountProductsUUIDs.has(p.uuid)
          );

          break;
        }
        case DiscountScopeEnum.PRODUCT_FEATURES: {
          const discountProductCategoriesUUIDs = new Set(
            discount.product_categories.map(c => c.uuid)
          );

          validatedProducts = orderedProducts.filter(p => {
            const productModifiersUUIDs = new Set(p.modifiers.map(c => c.uuid));

            const hasCategory = discountProductCategoriesUUIDs.has(
              p.category_uuid
            );

            const hasModifier = discount.modifiers.every(m =>
              productModifiersUUIDs.has(m.uuid)
            );

            return (
              (!discount.product_categories.length || hasCategory) &&
              hasModifier
            );
          });

          break;
        }
        case DiscountScopeEnum.GLOBAL: {
          validatedProducts = orderedProducts;

          break;
        }
      }

      const checkValue = this.getCheckValue(discount, validatedProducts);

      if (
        !this.isFulfilledCondition(
          discount,
          checkValue,
          discount.scope === DiscountScopeEnum.GLOBAL
        )
      )
        break;

      return this.getFinalDiscount(
        validatedProducts,
        discount,
        checkValue,
        totalOrderCost
      );
    }

    return 0;
  }

  private getCheckValue(
    discount: DiscountEntity,
    products: DiscountProduct[]
  ): number {
    if (discount.condition.criteria === DiscountCriteriaEnum.COUNT)
      return products.reduce((count, p) => count + p.count, 0);

    if (discount.condition.criteria === DiscountCriteriaEnum.PRICE)
      return products.reduce(
        (totalPrice, p) => totalPrice + p.full_price * p.count,
        0
      );

    return 0;
  }

  private getFinalDiscount(
    products: DiscountProduct[],
    discount: DiscountEntity,
    checkValue: number,
    totalOrderCost: number
  ): number {
    let finalDiscount = 0;

    switch (discount.type) {
      case DiscountTypeEnum.PERCENT: {
        let localDiscount = 0;
        let localCheckValue = checkValue;

        if (discount.scope === DiscountScopeEnum.GLOBAL) {
          finalDiscount = (totalOrderCost * discount.value) / 100;
          break;
        }

        if (
          discount.condition.op === DiscountOperatorEnum.EQUAL &&
          discount.condition.criteria === DiscountCriteriaEnum.COUNT
        ) {
          let currentProductCount = 0;
          for (const product of products) {
            let availableProductCount = product.count;

            do {
              const productCount = Math.min(
                availableProductCount,
                discount.condition.value - currentProductCount
              );

              availableProductCount -= productCount;
              currentProductCount += productCount;
              localDiscount += product.full_price * productCount;
              localCheckValue -= productCount;

              if (currentProductCount < discount.condition.value) break;
              else {
                finalDiscount += (localDiscount * discount.value) / 100;
                localDiscount = 0;
                currentProductCount = 0;
              }
            } while (
              localCheckValue >= discount.condition.value &&
              availableProductCount
            );
          }
        } else {
          finalDiscount =
            (products.reduce(
              (totalPrice, p) => totalPrice + p.full_price * p.count,
              0
            ) *
              discount.value) /
            100;
        }
        break;
      }
      case DiscountTypeEnum.IN_CASH: {
        if (
          discount.scope === DiscountScopeEnum.GLOBAL ||
          discount.condition.criteria === DiscountCriteriaEnum.PRICE
        ) {
          finalDiscount = discount.value;
          break;
        }

        const diff = Math.floor(checkValue / discount.condition.value) || 1;
        finalDiscount = diff * discount.value;

        break;
      }
      case DiscountTypeEnum.FIXED_PRICE: {
        let localDiscount = 0;
        let localCheckValue = checkValue;

        if (
          discount.scope === DiscountScopeEnum.GLOBAL ||
          discount.condition.criteria !== DiscountCriteriaEnum.COUNT ||
          discount.condition.op !== DiscountOperatorEnum.EQUAL
        )
          throw new Error(`The invalid discount`);

        let currentProductCount = 0;
        for (const product of products) {
          let availableProductCount = product.count;

          do {
            const productCount = Math.min(
              availableProductCount,
              discount.condition.value - currentProductCount
            );

            availableProductCount -= productCount;
            currentProductCount += productCount;
            localDiscount += product.full_price * productCount;
            localCheckValue -= productCount;

            if (currentProductCount < discount.condition.value) break;
            else {
              finalDiscount += localDiscount - discount.value;
              localDiscount = 0;
              currentProductCount = 0;
            }
          } while (
            localCheckValue >= discount.condition.value &&
            availableProductCount
          );
        }
        break;
      }
    }

    return finalDiscount;
  }
}
