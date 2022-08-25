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
import { IDiscountProductCategory } from "@monorepo/common";
import DiscountEntity from "./discount.entity";
import ProductCategoryEntity from "./product-category.entity";

@Entity("discount_product_categories")
export class DiscountProductCategoryEntity
  extends IEntity
  implements IDiscountProductCategory
{
  @Column({ type: "uuid" })
  discount_uuid: string;

  @ManyToOne(() => DiscountEntity, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "product_uuid",
    referencedColumnName: "uuid",
    foreignKeyConstraintName: "fk_discount_product_categories_discount_uuid",
  })
  discount?: DiscountEntity;

  @Column({ type: "uuid" })
  category_uuid: string;

  @ManyToOne(() => ProductCategoryEntity, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "product_category_uuid",
    referencedColumnName: "uuid",
    foreignKeyConstraintName:
      "fk_discount_product_categories_product_category_uuid",
  })
  category?: ProductCategoryEntity;

  @ManyToMany(() => ModifierEntity)
  @JoinTable({
    name: "discount_product_categories_modifiers",
    joinColumn: {
      name: "discount_product_categories",
      referencedColumnName: "uuid",
      foreignKeyConstraintName:
        "fk_discount_product_categories_discount_product_categories_uuid",
    },
    inverseJoinColumn: {
      name: "modifier",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_discount_product_categories_modifier_uuid",
    },
  })
  modifiers: ModifierEntity[];
}

export default DiscountProductCategoryEntity;
