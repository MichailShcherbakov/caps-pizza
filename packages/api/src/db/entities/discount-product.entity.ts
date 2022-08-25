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
import ProductEntity from "./product.entity";
import { IDiscountProduct } from "@monorepo/common";
import DiscountEntity from "./discount.entity";

@Entity("discount_products")
export class DiscountProductEntity extends IEntity implements IDiscountProduct {
  @Column({ type: "uuid" })
  discount_uuid: string;

  @ManyToOne(() => DiscountEntity, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "product_uuid",
    referencedColumnName: "uuid",
    foreignKeyConstraintName: "fk_discount_products_discount_uuid",
  })
  discount?: DiscountEntity;

  @Column({ type: "uuid" })
  product_uuid: string;

  @ManyToOne(() => ProductEntity, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "product_uuid",
    referencedColumnName: "uuid",
    foreignKeyConstraintName: "fk_discount_products_product_uuid",
  })
  product?: ProductEntity;

  @ManyToMany(() => ModifierEntity)
  @JoinTable({
    name: "discount_products_modifiers",
    joinColumn: {
      name: "discount_products",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_discount_products_discount_products_uuid",
    },
    inverseJoinColumn: {
      name: "modifier",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_discount_products_modifier_uuid",
    },
  })
  modifiers: ModifierEntity[];
}

export default DiscountProductEntity;
