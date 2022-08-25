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
  DiscountTypeEnum,
} from "~/db/entities/discount.entity";
import ModifierEntity from "~/db/entities/modifier.entity";
import ModifiersService from "../modifiers/modifiers.service";
import { Order } from "../orders/orders.dto";
import ProductCategoriesService from "../products/modules/categories/categories.service";
import ProductsService from "../products/products.service";
import { CreateDiscountDto, UpdateDiscountDto } from "./discounts.dto";
import { getSuitableDiscounts } from "@monorepo/common/modules/discounts";
import { IProductWithFullPrice } from "@monorepo/common";
import DiscountProductEntity from "~/db/entities/discount-product.entity";
import DiscountProductCategoryEntity from "~/db/entities/discount-product-category.entity";

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
        products: {
          modifiers: true,
        },
        product_categories: {
          modifiers: true,
        },
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

    if (dto.type === DiscountTypeEnum.FIXED_PRICE) {
      if (
        !dto.products.length &&
        !dto.product_categories.length &&
        !dto.modifiers.length
      )
        throw new BadRequestException(
          `The ${DiscountTypeEnum.FIXED_PRICE} discount type is not available in global discount scope`
        );

      if (dto.condition.criteria !== DiscountCriteriaEnum.COUNT)
        throw new BadRequestException(
          `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountCriteriaEnum.COUNT} discount criteria`
        );

      if (dto.condition.op !== DiscountOperatorEnum.EQUAL)
        throw new BadRequestException(
          `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountOperatorEnum.EQUAL} discount operator`
        );
    }

    if (
      dto.condition.op === DiscountOperatorEnum.BETWEEN &&
      !dto.condition.value2
    )
      throw new BadRequestException(
        `The discount has the ${DiscountOperatorEnum.BETWEEN} condition operator, but the value2 was not provided`
      );

    const e = new DiscountEntity();
    e.name = dto.name;
    e.value = dto.value;
    e.type = dto.type;
    e.condition = dto.condition;
    e.products = [];
    e.product_categories = [];
    e.modifiers = [];

    const modifiersUUIDs: string[] = dto.modifiers.map(
      ({ modifier_uuid }) => modifier_uuid
    );

    dto.products.forEach(({ modifiers_uuids }) => {
      modifiersUUIDs.push(...modifiers_uuids);
    });

    dto.product_categories.forEach(({ modifiers_uuids }) => {
      modifiersUUIDs.push(...modifiers_uuids);
    });

    const modifiers = new Map(
      (
        await this.modifiersService.find({
          uuid: In(modifiersUUIDs),
        })
      ).map(modifier => [modifier.uuid, modifier])
    );

    if (dto.products.length) {
      const products = new Map(
        (
          await this.productsService.find({
            uuid: In(dto.products.map(({ product_uuid }) => product_uuid)),
          })
        ).map(p => [p.uuid, p])
      );

      const discountProducts: DiscountProductEntity[] = [];

      for (const { product_uuid, modifiers_uuids } of dto.products) {
        const product = products.get(product_uuid);

        if (!product)
          throw new NotFoundException(
            `The product ${product_uuid} does not exist`
          );

        const productModifiers = modifiers_uuids.map(modifierUUID => {
          const modifier = modifiers.get(modifierUUID);

          if (!modifier)
            throw new NotFoundException(
              `The modifier ${modifierUUID} does not exist`
            );

          return modifier;
        });

        const discountProduct = new DiscountProductEntity();
        discountProduct.product_uuid = product.uuid;
        discountProduct.modifiers = productModifiers;

        discountProducts.push(discountProduct);
      }

      e.products = discountProducts;
    }

    if (dto.product_categories.length) {
      const productCategories = new Map(
        (
          await this.productCategoriesService.find({
            uuid: In(
              dto.product_categories.map(({ category_uuid }) => category_uuid)
            ),
          })
        ).map(c => [c.uuid, c])
      );

      const discountProductCategories: DiscountProductCategoryEntity[] = [];

      for (const { category_uuid, modifiers_uuids } of dto.product_categories) {
        const category = productCategories.get(category_uuid);

        if (!category)
          throw new NotFoundException(
            `The product category ${category_uuid} does not exist`
          );

        const productModifiers = modifiers_uuids.map(modifierUUID => {
          const modifier = modifiers.get(modifierUUID);

          if (!modifier)
            throw new NotFoundException(
              `The modifier ${modifierUUID} does not exist`
            );

          return modifier;
        });

        const discountProductCategory = new DiscountProductCategoryEntity();
        discountProductCategory.category_uuid = category.uuid;
        discountProductCategory.modifiers = productModifiers;

        discountProductCategories.push(discountProductCategory);
      }

      e.product_categories = discountProductCategories;
    }

    if (dto.modifiers.length) {
      e.modifiers = dto.modifiers.map(({ modifier_uuid }) => {
        const modifier = modifiers.get(modifier_uuid);

        if (!modifier)
          throw new NotFoundException(
            `The modifier ${modifier_uuid} does not exist`
          );

        return modifier;
      });
    }

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
        (!dto.products?.length &&
          !dto.product_categories?.length &&
          !dto.modifiers?.length &&
          !foundDiscount.products.length &&
          !foundDiscount.product_categories.length &&
          !foundDiscount.modifiers.length) ||
        (dto.products &&
          !dto.products.length &&
          foundDiscount.products.length) ||
        (dto.product_categories &&
          !dto.product_categories.length &&
          foundDiscount.product_categories.length) ||
        (dto.modifiers &&
          !dto.modifiers.length &&
          foundDiscount.modifiers.length)
      )
        throw new BadRequestException(
          `The ${DiscountTypeEnum.FIXED_PRICE} discount type is not available in global discount scope`
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

    if (dto.condition) {
      if (
        dto.condition.op === DiscountOperatorEnum.BETWEEN &&
        !dto.condition.value2
      )
        throw new BadRequestException(
          `The discount has the ${DiscountOperatorEnum.BETWEEN} condition operator, but the value2 was not provided`
        );
    }

    const modifiersUUIDs: string[] =
      dto.modifiers?.map(({ modifier_uuid }) => modifier_uuid) ?? [];

    dto.products?.forEach(({ modifiers_uuids }) => {
      modifiersUUIDs.push(...modifiers_uuids);
    });

    dto.product_categories?.forEach(({ modifiers_uuids }) => {
      modifiersUUIDs.push(...modifiers_uuids);
    });

    const modifiers = new Map(
      (
        await this.modifiersService.find({
          uuid: In(modifiersUUIDs),
        })
      ).map(modifier => [modifier.uuid, modifier])
    );

    if (dto.products?.length) {
      const products = new Map(
        (
          await this.productsService.find({
            uuid: In(dto.products.map(({ product_uuid }) => product_uuid)),
          })
        ).map(p => [p.uuid, p])
      );

      const discountProducts: DiscountProductEntity[] = [];

      for (const { product_uuid, modifiers_uuids } of dto.products) {
        const product = products.get(product_uuid);

        if (!product)
          throw new NotFoundException(
            `The product ${product_uuid} does not exist`
          );

        const productModifiers = modifiers_uuids.map(modifierUUID => {
          const modifier = modifiers.get(modifierUUID);

          if (!modifier)
            throw new NotFoundException(
              `The modifier ${modifierUUID} does not exist`
            );

          return modifier;
        });

        const discountProduct = new DiscountProductEntity();
        discountProduct.product_uuid = product.uuid;
        discountProduct.modifiers = productModifiers;

        discountProducts.push(discountProduct);
      }

      foundDiscount.products = discountProducts;
    }

    if (dto.product_categories?.length) {
      const productCategories = new Map(
        (
          await this.productCategoriesService.find({
            uuid: In(
              dto.product_categories.map(({ category_uuid }) => category_uuid)
            ),
          })
        ).map(c => [c.uuid, c])
      );

      const discountProductCategories: DiscountProductCategoryEntity[] = [];

      for (const { category_uuid, modifiers_uuids } of dto.product_categories) {
        const category = productCategories.get(category_uuid);

        if (!category)
          throw new NotFoundException(
            `The product category ${category_uuid} does not exist`
          );

        const productModifiers = modifiers_uuids.map(modifierUUID => {
          const modifier = modifiers.get(modifierUUID);

          if (!modifier)
            throw new NotFoundException(
              `The modifier ${modifierUUID} does not exist`
            );

          return modifier;
        });

        const discountProductCategory = new DiscountProductCategoryEntity();
        discountProductCategory.category_uuid = category.uuid;
        discountProductCategory.modifiers = productModifiers;

        discountProductCategories.push(discountProductCategory);
      }

      foundDiscount.product_categories = discountProductCategories;
    }

    if (dto.modifiers?.length) {
      foundDiscount.modifiers = dto.modifiers.map(({ modifier_uuid }) => {
        const modifier = modifiers.get(modifier_uuid);

        if (!modifier)
          throw new NotFoundException(
            `The modifier ${modifier_uuid} does not exist`
          );

        return modifier;
      });
    }

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
      this.find(),
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

    const productsWithFullPrice: IProductWithFullPrice[] = order.products
      .map(p => {
        const product = products.get(p.uuid);

        if (!product)
          throw new NotFoundException(`The product ${p.uuid} does not exist`);

        return {
          ...product,
          count: p.count,
          fullPrice:
            product.price +
            p.modifiers.reduce((totalModifiersCost, orderedProductModifier) => {
              const modifier = modifiers.get(orderedProductModifier.uuid);

              if (!modifier)
                throw new NotFoundException(
                  `The modifier ${orderedProductModifier.uuid} does not exist`
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

    const suitableDiscounts = getSuitableDiscounts(
      discounts,
      productsWithFullPrice
    );

    return suitableDiscounts.reduce(
      (amount, { discountValue }) => amount + discountValue,
      0
    );
  }
}
