import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import IEntity from "./entity.inteface";
import ProductCategoryEntity from "./product-category.entity";
import ProductEntity from "./product.entity";

export enum DiscountTypeEnum {
  PERCENT = "PERCENT",
  IN_CASH = "IN_CASH",
}

export enum DiscountCriteriaEnum {
  PRICE = "PRICE",
  COUNT = "COUNT",
}

export enum DiscountScopeEnum {
  PRODUCTS = "PRODUCTS",
  PRODUCT_CATEGORIES = "PRODUCT_CATEGORIES",
  GLOBAL = "GLOBAL",
}

export enum DiscountOperatorEnum {
  LESS = "LESS",
  GREATER = "GREATER",
  NOT_EQUAL = "NOT_EQUAL",
  EQUAL = "EQUAL",
  BETWEEN = "BETWEEN",
}

export class DiscountСondition {
  @IsNotEmpty()
  @IsEnum(DiscountCriteriaEnum)
  criteria: DiscountCriteriaEnum;

  @IsNotEmpty()
  @IsEnum(DiscountOperatorEnum)
  op: DiscountOperatorEnum;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number;
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
}
