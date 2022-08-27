import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import IEntity from "./entity.inteface";
import ModifierEntity from "./modifier.entity";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
  IDiscountStrategy,
  IDiscountCondition,
} from "@monorepo/common";
import ProductEntity from "./product.entity";
import ProductCategoryEntity from "./product-category.entity";
import DiscountEntity from "./discount.entity";

export { DiscountCriteriaEnum, DiscountOperatorEnum, DiscountTypeEnum };

export class DiscountСondition implements IDiscountCondition {
  @IsEnum(DiscountCriteriaEnum)
  @IsNotEmpty()
  criteria: DiscountCriteriaEnum;

  @IsEnum(DiscountOperatorEnum)
  @IsNotEmpty()
  op: DiscountOperatorEnum;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  value: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  value2?: number;
}

@Entity("discount_strategies")
export default class DiscountStrategyEntity
  extends IEntity
  implements IDiscountStrategy
{
  @Column({ type: "uuid" })
  discount_uuid: string;

  @ManyToOne(() => DiscountEntity, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "discount_uuid",
    referencedColumnName: "uuid",
    foreignKeyConstraintName: "fk_discount_uuid",
  })
  discount?: DiscountEntity;

  @Column({ type: "jsonb" })
  condition: DiscountСondition;

  @ManyToMany(() => ProductEntity, { onDelete: "CASCADE" })
  @JoinTable({
    name: "discount_strategy_products",
    joinColumn: {
      name: "discount_strategy",
      referencedColumnName: "uuid",
      foreignKeyConstraintName:
        "fk_discount_strategy_products_discount_strategy_uuid",
    },
    inverseJoinColumn: {
      name: "modifier",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_discount_strategy_products_modifier_uuid",
    },
  })
  products: ProductEntity[];

  @ManyToMany(() => ProductCategoryEntity, { onDelete: "CASCADE" })
  @JoinTable({
    name: "discount_strategy_product_categories",
    joinColumn: {
      name: "discount_strategy",
      referencedColumnName: "uuid",
      foreignKeyConstraintName:
        "fk_discount_strategy_product_categories_discount_strategy_uuid",
    },
    inverseJoinColumn: {
      name: "modifier",
      referencedColumnName: "uuid",
      foreignKeyConstraintName:
        "fk_discount_strategy_product_categories_modifier_uuid",
    },
  })
  product_categories: ProductCategoryEntity[];

  @ManyToMany(() => ModifierEntity, { onDelete: "CASCADE" })
  @JoinTable({
    name: "discount_strategy_modifiers",
    joinColumn: {
      name: "discount_strategy",
      referencedColumnName: "uuid",
      foreignKeyConstraintName:
        "fk_discount_strategy_modifiers_discount_strategy_uuid",
    },
    inverseJoinColumn: {
      name: "modifier",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_discount_strategy_modifiers_modifier_uuid",
    },
  })
  modifiers: ModifierEntity[];
}
