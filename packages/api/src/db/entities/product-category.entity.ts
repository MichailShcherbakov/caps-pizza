import { Column, Entity } from "typeorm";
import { IProductCategory } from "@monorepo/common";
import IEntity from "./entity.inteface";

@Entity("product_categories")
export default class ProductCategoryEntity
  extends IEntity
  implements IProductCategory
{
  @Column({ unique: true })
  name: string;

  @Column()
  image_url: string;

  @Column({ nullable: true })
  display_position?: number;

  static compare(a?: ProductCategoryEntity, b?: ProductCategoryEntity): number {
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
