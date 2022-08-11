import { Column, Entity } from "typeorm";
import IEntity from "./entity.inteface";

@Entity("modifier_categories")
export default class ModifierCategoryEntity extends IEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  image_url?: string;

  @Column({ nullable: true })
  display_position?: number;

  static compare(
    a?: ModifierCategoryEntity,
    b?: ModifierCategoryEntity
  ): number {
    if (!a && b) return 1;
    else if (a && !b) return -1;
    else if (!a || !b) return 0;
    else if (!a.display_position && b.display_position) return 1;
    else if (a.display_position && !b.display_position) return -1;
    else if (!a.display_position || !b.display_position) return 0;
    else if (a.display_position < b.display_position) return -1;
    else if (a.display_position > b.display_position) return 1;
    else if (a.name < b.name) return -1;
    else if (a.name > b.name) return 1;
    return 0;
  }
}
