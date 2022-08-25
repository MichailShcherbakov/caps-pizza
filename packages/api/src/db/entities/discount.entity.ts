import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import IEntity from "./entity.inteface";
import ModifierEntity from "./modifier.entity";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
  IDiscount,
  IDiscountСondition,
} from "@monorepo/common";
import DiscountProductEntity from "./discount-product.entity";
import DiscountProductCategoryEntity from "./discount-product-category.entity";

export { DiscountCriteriaEnum, DiscountOperatorEnum, DiscountTypeEnum };

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
export default class DiscountEntity extends IEntity implements IDiscount {
  @Column({ unique: true })
  name: string;

  @Column({ type: "varchar" })
  type: DiscountTypeEnum;

  @Column({ type: "jsonb" })
  condition: DiscountСondition;

  @Column({ type: "float4" })
  value: number;

  @OneToMany(() => DiscountProductEntity, product => product.discount)
  products: DiscountProductEntity[];

  @OneToMany(() => DiscountProductCategoryEntity, category => category.discount)
  product_categories: DiscountProductCategoryEntity[];

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
