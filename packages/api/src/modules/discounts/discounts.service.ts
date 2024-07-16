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
import DiscountStrategyEntity from "~/db/entities/discount-strategy.entity";

@Injectable()
export default class DiscountsService {
  constructor(
    @InjectRepository(DiscountEntity)
    private readonly discountRepository: Repository<DiscountEntity>,
    @InjectRepository(DiscountStrategyEntity)
    private readonly discountStrategiesRepository: Repository<DiscountStrategyEntity>,
    private readonly productsService: ProductsService,
    private readonly productCategoriesService: ProductCategoriesService,
    private readonly modifiersService: ModifiersService
  ) {}

  find(options?: FindOptionsWhere<DiscountEntity>): Promise<DiscountEntity[]> {
    return this.discountRepository
      .find({
        where: options,
        order: {
          strategies: {
            products: {
              name: "ASC",
            },
            product_categories: {
              name: "ASC",
            },
            modifiers: {
              name: "ASC",
            },
          },
        },
        relations: {
          strategies: {
            products: true,
            product_categories: true,
            modifiers: true,
          },
        },
      })
      .then(discounts => DiscountsService.sort(discounts));
  }

  findOne(
    options?: FindOptionsWhere<DiscountEntity>
  ): Promise<DiscountEntity | null> {
    return this.discountRepository.findOne({
      where: options,
      order: {
        strategies: {
          products: {
            name: "ASC",
          },
          product_categories: {
            name: "ASC",
          },
          modifiers: {
            name: "ASC",
          },
        },
      },
      relations: {
        strategies: {
          products: true,
          product_categories: true,
          modifiers: true,
        },
      },
    });
  }

  async findOneOrFail(
    options?: FindOptionsWhere<DiscountEntity>
  ): Promise<DiscountEntity> {
    const foundDiscount = await this.findOne(options);

    if (!foundDiscount)
      throw new NotFoundException(
        `The discount ${options?.uuid} does not exist`
      );

    return foundDiscount;
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
    e.value = dto.value;
    e.type = dto.type;
    e.strategies = [];

    const strategies: DiscountStrategyEntity[] = [];

    const productsUUIDs = dto.strategies.reduce<string[]>(
      (array, { products_uuids }) => {
        array.push(...products_uuids);
        return array;
      },
      []
    );
    const products = new Map(
      (
        await this.productsService.find({
          uuid: In(productsUUIDs),
        })
      ).map(p => [p.uuid, p])
    );

    const productCategoriesUUIDs = dto.strategies.reduce<string[]>(
      (array, { product_categories_uuids }) => {
        array.push(...product_categories_uuids);
        return array;
      },
      []
    );
    const productCategories = new Map(
      (
        await this.productCategoriesService.find({
          uuid: In(productCategoriesUUIDs),
        })
      ).map(c => [c.uuid, c])
    );

    const modifiersUUIDs = dto.strategies.reduce<string[]>(
      (array, { modifiers_uuids }) => {
        array.push(...modifiers_uuids);
        return array;
      },
      []
    );
    const modifiers = new Map(
      (
        await this.modifiersService.find({
          uuid: In(modifiersUUIDs),
        })
      ).map(m => [m.uuid, m])
    );

    for (const strategy of dto.strategies) {
      if (dto.type === DiscountTypeEnum.FIXED_PRICE) {
        if (
          !strategy.products_uuids.length &&
          !strategy.product_categories_uuids.length &&
          !strategy.modifiers_uuids.length
        )
          throw new BadRequestException(
            `The ${DiscountTypeEnum.FIXED_PRICE} discount type is not available in global discount scope`
          );

        if (strategy.condition.criteria !== DiscountCriteriaEnum.COUNT)
          throw new BadRequestException(
            `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountCriteriaEnum.COUNT} discount criteria`
          );

        if (strategy.condition.op !== DiscountOperatorEnum.EQUAL)
          throw new BadRequestException(
            `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountOperatorEnum.EQUAL} discount operator`
          );
      }

      if (
        strategy.condition.op === DiscountOperatorEnum.BETWEEN &&
        !strategy.condition.value2
      )
        throw new BadRequestException(
          `The discount has the ${DiscountOperatorEnum.BETWEEN} condition operator, but the value2 was not provided`
        );

      const s = new DiscountStrategyEntity();
      s.condition = strategy.condition;
      s.products = [];
      s.product_categories = [];
      s.modifiers = [];

      for (const product_uuid of strategy.products_uuids) {
        const product = products.get(product_uuid);

        if (!product)
          throw new NotFoundException(
            `The product ${product_uuid} does not exist`
          );

        s.products.push(product);
      }

      for (const product_category_uuid of strategy.product_categories_uuids) {
        const productCategory = productCategories.get(product_category_uuid);

        if (!productCategory)
          throw new NotFoundException(
            `The product category ${product_category_uuid} does not exist`
          );

        s.product_categories.push(productCategory);
      }

      for (const modifier_uuid of strategy.modifiers_uuids) {
        const modifier = modifiers.get(modifier_uuid);

        if (!modifier)
          throw new NotFoundException(
            `The modifier ${modifier_uuid} does not exist`
          );

        s.modifiers.push(modifier);
      }

      strategies.push(s);
    }

    const discount = await this.discountRepository.save(e);

    await this.discountStrategiesRepository.save(
      strategies.map(s => ({ ...s, discount_uuid: discount.uuid }))
    );

    return this.findOneOrFail({ uuid: discount.uuid });
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
        foundDiscount.strategies.some(
          s =>
            !s.products.length &&
            !s.product_categories.length &&
            !s.modifiers.length
        )
      )
        throw new BadRequestException(
          `The ${DiscountTypeEnum.FIXED_PRICE} discount type is not available in global discount scope`
        );

      if (
        foundDiscount.strategies.some(
          s => s.condition.criteria !== DiscountCriteriaEnum.COUNT
        )
      )
        throw new BadRequestException(
          `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountCriteriaEnum.COUNT} discount criteria`
        );

      if (
        foundDiscount.strategies.some(
          s => s.condition.op !== DiscountOperatorEnum.EQUAL
        )
      )
        throw new BadRequestException(
          `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountOperatorEnum.EQUAL} discount operator`
        );
    }

    foundDiscount.type = dto.type ?? foundDiscount.type;
    foundDiscount.value = dto.value ?? foundDiscount.value;

    await this.discountRepository.save(foundDiscount);

    if (dto.strategies) {
      const productsUUIDs = dto.strategies.reduce<string[]>(
        (array, { products_uuids }) => {
          array.push(...products_uuids);
          return array;
        },
        []
      );
      const products = new Map(
        (
          await this.productsService.find({
            uuid: In(productsUUIDs),
          })
        ).map(p => [p.uuid, p])
      );

      const productCategoriesUUIDs = dto.strategies.reduce<string[]>(
        (array, { product_categories_uuids }) => {
          array.push(...product_categories_uuids);
          return array;
        },
        []
      );
      const productCategories = new Map(
        (
          await this.productCategoriesService.find({
            uuid: In(productCategoriesUUIDs),
          })
        ).map(c => [c.uuid, c])
      );

      const modifiersUUIDs = dto.strategies.reduce<string[]>(
        (array, { modifiers_uuids }) => {
          array.push(...modifiers_uuids);
          return array;
        },
        []
      );
      const modifiers = new Map(
        (
          await this.modifiersService.find({
            uuid: In(modifiersUUIDs),
          })
        ).map(m => [m.uuid, m])
      );

      const strategies: DiscountStrategyEntity[] = [];

      for (const strategy of dto.strategies) {
        if (
          dto.type === DiscountTypeEnum.FIXED_PRICE ||
          (!dto.type && foundDiscount.type === DiscountTypeEnum.FIXED_PRICE)
        ) {
          if (
            (!strategy.products_uuids.length &&
              !strategy.product_categories_uuids.length &&
              !strategy.modifiers_uuids.length) ||
            foundDiscount.strategies.some(
              s =>
                !s.products.length &&
                !s.product_categories.length &&
                !s.modifiers.length
            )
          )
            throw new BadRequestException(
              `The ${DiscountTypeEnum.FIXED_PRICE} discount type is not available in global discount scope`
            );

          if (strategy.condition.criteria !== DiscountCriteriaEnum.COUNT)
            throw new BadRequestException(
              `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountCriteriaEnum.COUNT} discount criteria`
            );

          if (strategy.condition.op !== DiscountOperatorEnum.EQUAL)
            throw new BadRequestException(
              `The ${DiscountTypeEnum.FIXED_PRICE} discount type is available with only ${DiscountOperatorEnum.EQUAL} discount operator`
            );
        }

        if (
          strategy.condition.op === DiscountOperatorEnum.BETWEEN &&
          !strategy.condition.value2
        )
          throw new BadRequestException(
            `The discount has the ${DiscountOperatorEnum.BETWEEN} condition operator, but the value2 was not provided`
          );

        const s = new DiscountStrategyEntity();
        s.discount_uuid = foundDiscount.uuid;
        s.condition = strategy.condition;
        s.products = [];
        s.product_categories = [];
        s.modifiers = [];

        for (const product_uuid of strategy.products_uuids) {
          const product = products.get(product_uuid);

          if (!product)
            throw new NotFoundException(
              `The product ${product_uuid} does not exist`
            );

          s.products.push(product);
        }

        for (const product_category_uuid of strategy.product_categories_uuids) {
          const productCategory = productCategories.get(product_category_uuid);

          if (!productCategory)
            throw new NotFoundException(
              `The product category ${product_category_uuid} does not exist`
            );

          s.product_categories.push(productCategory);
        }

        for (const modifier_uuid of strategy.modifiers_uuids) {
          const modifier = modifiers.get(modifier_uuid);

          if (!modifier)
            throw new NotFoundException(
              `The modifier ${modifier_uuid} does not exist`
            );

          s.modifiers.push(modifier);
        }

        strategies.push(s);
      }

      await this.discountStrategiesRepository.delete({
        discount_uuid: foundDiscount.uuid,
      });

      await this.discountStrategiesRepository.save(strategies);
    }

    return this.findOneOrFail({ uuid: foundDiscount.uuid });
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
