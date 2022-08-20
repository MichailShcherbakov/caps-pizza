import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import IEntity from "./entity.inteface";
import ModifierEntity from "./modifier.entity";
import ProductCategoryEntity from "./product-category.entity";
import ProductEntity from "./product.entity";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
  IDiscountСondition,
} from "@monorepo/common";

export {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
};

export class DiscountСondition implements IDiscountСondition {
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

@Entity("discounts")
export default class DiscountEntity extends IEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: "varchar" })
  type: DiscountTypeEnum;

  @Column({ type: "varchar" })
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

  static compare(a?: DiscountEntity, b?: DiscountEntity): number {
    if (!a && b) return 1;
    else if (a && !b) return -1;
    else if (!a || !b) return 0;
    else if (a.created_at < b.created_at) return -1;
    else if (a.created_at > b.created_at) return 1;
    return 0;
  }
}
