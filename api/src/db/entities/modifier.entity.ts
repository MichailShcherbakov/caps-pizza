import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import IEntity from "./entity.inteface";
import ModifierCategoryEntity from "./modifier-category.entity";

@Entity("modifiers")
export default class ModifierEntity extends IEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  desc?: string;

  @Column({ type: "int4", unique: true })
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
    foreignKeyConstraintName: "fk_modifiers_category_uuid",
  })
  category?: ModifierCategoryEntity;
}
