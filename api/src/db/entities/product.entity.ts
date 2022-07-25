import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CategoryEntity } from "./category.entity";
import IEntity from "./entity.inteface";

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

  @Column({ type: "uuid" })
  category_uuid: string;

  @ManyToOne(() => CategoryEntity, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "category_uuid",
    referencedColumnName: "uuid",
  })
  category: CategoryEntity;
}

export default ProductEntity;
