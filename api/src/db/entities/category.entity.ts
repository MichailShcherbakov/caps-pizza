import { Column, Entity } from "typeorm";
import IEntity from "./entity.inteface";

@Entity("categories")
export class CategoryEntity extends IEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  image_url: string;
}

export default CategoryEntity;
