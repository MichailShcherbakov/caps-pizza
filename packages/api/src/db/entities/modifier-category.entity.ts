import { Column, Entity } from "typeorm";
import {
  IModifierCategory,
  ModifierCategoryChoiceOptionEnum,
  ModifierCategoryDisplayVariantEnum,
} from "@monorepo/common";
import IEntity from "./entity.interface";

@Entity("modifier_categories")
export default class ModifierCategoryEntity
  extends IEntity
  implements IModifierCategory
{
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  image_url?: string;

  @Column()
  choice_option: ModifierCategoryChoiceOptionEnum;

  @Column()
  display: boolean;

  @Column({ unique: true, nullable: true })
  display_name?: string;

  @Column()
  display_variant: ModifierCategoryDisplayVariantEnum;

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
