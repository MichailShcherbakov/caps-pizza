import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import ProductCategoryEntity from "./product-category.entity";
import IEntity from "./entity.inteface";
import ModifierEntity from "./modifier.entity";

@Entity("products")
export class ProductEntity extends IEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  desc?: string;

  @Column({ type: "int4" })
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
  })
  category: ProductCategoryEntity;

  @ManyToMany(() => ModifierEntity)
  modifiers: ModifierEntity[];
}

export default ProductEntity;
