import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import ProductCategoryEntity from "./product-category.entity";
import IEntity from "./entity.inteface";
import ModifierEntity from "./modifier.entity";

@Entity("products")
export class ProductEntity extends IEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  desc?: string;

  @Column({ type: "int4", unique: true })
  article_number: number;

  @Column()
  image_url: string;

  @Column({ type: "float4" })
  price: number;

  @Column({ type: "uuid" })
  category_uuid: string;

  @ManyToOne(() => ProductCategoryEntity, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "category_uuid",
    referencedColumnName: "uuid",
    foreignKeyConstraintName: "fk_products_category_uuid",
  })
  category?: ProductCategoryEntity;

  @ManyToMany(() => ModifierEntity)
  @JoinTable({
    name: "product_modifiers",
    joinColumn: {
      name: "product",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_product_modifiers_product_uuid",
    },
    inverseJoinColumn: {
      name: "modifier",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_product_modifiers_modifier_uuid",
    },
  })
  modifiers: ModifierEntity[];
}

export default ProductEntity;
