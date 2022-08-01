import { Column, Entity } from "typeorm";
import IEntity from "./entity.inteface";

@Entity("modifier_categories")
export default class ModifierCategoryEntity extends IEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  image_url?: string;
}
