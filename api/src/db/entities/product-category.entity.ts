import { Column, Entity } from "typeorm";
import IEntity from "./entity.inteface";

@Entity("product_categories")
export default class ProductCategoryEntity extends IEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  image_url: string;

  @Column({ nullable: true })
  display_position?: number;
}
