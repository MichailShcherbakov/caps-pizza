import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CategoryEntity } from "./category.entity";
import IEntity from "./entity.inteface";

@Entity("products")
export class ProductEntity extends IEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  desc?: string;

  @Column({ type: "number" })
  article_number: number;

  @Column()
  image_url: string;

  @Column({ type: "uuid" })
  public category_uuid: string;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({
    name: "category_uuid",
    referencedColumnName: "uuid",
  })
  public category: CategoryEntity;
}

export default ProductEntity;
