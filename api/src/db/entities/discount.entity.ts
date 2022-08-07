import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from "class-validator";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import IEntity from "./entity.inteface";
import ModifierEntity from "./modifier.entity";
import ProductCategoryEntity from "./product-category.entity";
import ProductEntity from "./product.entity";

export enum DiscountTypeEnum {
  PERCENT = "PERCENT",
  IN_CASH = "IN_CASH",
  FIXED_PRICE = "FIXED_PRICE",
}

export enum DiscountCriteriaEnum {
  PRICE = "PRICE",
  COUNT = "COUNT",
}

export enum DiscountScopeEnum {
  PRODUCTS = "PRODUCTS",
  PRODUCT_FEATURES = "PRODUCT_FEATURES",
  GLOBAL = "GLOBAL",
}

export enum DiscountOperatorEnum {
  LESS = "LESS",
  GREATER = "GREATER",
  EQUAL = "EQUAL",
  BETWEEN = "BETWEEN",
}

export class DiscountСondition {
  @IsEnum(DiscountCriteriaEnum)
  @IsNotEmpty()
  criteria: DiscountCriteriaEnum;

  @IsEnum(DiscountOperatorEnum)
  @IsNotEmpty()
  op: DiscountOperatorEnum;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  value: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsOptional()
  value2?: number;
}

@Entity("discounts")
export default class DiscountEntity extends IEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  type: DiscountTypeEnum;

  @Column()
  scope: DiscountScopeEnum;

  @Column({ type: "jsonb" })
  condition: DiscountСondition;

  @Column({ type: "float4" })
  value: number;

  @ManyToMany(() => ProductEntity)
  @JoinTable({
    name: "discount_products",
    joinColumn: {
      name: "discount",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_discount_products_discount_uuid",
    },
    inverseJoinColumn: {
      name: "product",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_discount_products_product_uuid",
    },
  })
  products: ProductEntity[];

  @ManyToMany(() => ProductCategoryEntity)
  @JoinTable({
    name: "discount_product_categories",
    joinColumn: {
      name: "discount",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_discount_products_discount_uuid",
    },
    inverseJoinColumn: {
      name: "product_category",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_discount_products_product_category_uuid",
    },
  })
  product_categories: ProductCategoryEntity[];

  @ManyToMany(() => ModifierEntity)
  @JoinTable({
    name: "discount_modifiers",
    joinColumn: {
      name: "discount",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_discount_modifiers_discount_uuid",
    },
    inverseJoinColumn: {
      name: "modifier",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_discount_modifiers_modifier_uuid",
    },
  })
  modifiers: ModifierEntity[];
}
