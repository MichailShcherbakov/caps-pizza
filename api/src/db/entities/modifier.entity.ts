import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import IEntity from "./entity.inteface";
import ModifierCategoryEntity from "./modifier-category.entity";

@Entity("modifiers")
export default class ModifierEntity extends IEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  desc?: string;

  @Column({ type: "int4" })
  article_number: number;

  @Column({ nullable: true })
  image_url?: string;

  @Column({ type: "float4" })
  price: number;

  @Column({ nullable: true })
  display_position?: number;

  @Column({ type: "uuid" })
  category_uuid: string;

  @ManyToOne(() => ModifierCategoryEntity, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "category_uuid",
    referencedColumnName: "uuid",
  })
  category: ModifierCategoryEntity;
}
