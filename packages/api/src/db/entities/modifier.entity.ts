import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { IModifier } from "@monorepo/common";
import IEntity from "./entity.interface";
import ModifierCategoryEntity from "./modifier-category.entity";

@Entity("modifiers")
export default class ModifierEntity extends IEntity implements IModifier {
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

  @Column()
  display: boolean;

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

  static compare(a?: ModifierEntity, b?: ModifierEntity): number {
    const categoryCompare = ModifierCategoryEntity.compare(
      a?.category,
      b?.category
    );

    if (categoryCompare !== 0) return categoryCompare;
    else if (!a && b) return 1;
    else if (a && !b) return -1;
    else if (!a || !b) return 0;
    else if (!a.display_position && b.display_position) return 1;
    else if (a.display_position && !b.display_position) return -1;
    else if (!a.display_position || !b.display_position) return 0;
    else if (a.display_position < b.display_position) return -1;
    else if (a.display_position > b.display_position) return 1;
    return 0;
  }
}
