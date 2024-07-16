import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { IProductCategory } from "@monorepo/common";
import IEntity from "./entity.interface";

@Entity("product_categories")
export default class ProductCategoryEntity
  extends IEntity
  implements IProductCategory
{
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  image_url?: string;

  @Column()
  display: boolean;

  @Column({ nullable: true })
  display_position?: number;

  @Column({ type: "uuid", nullable: true })
  parent_uuid?: string | null;

  @ManyToOne(() => ProductCategoryEntity, { onDelete: "SET NULL" })
  @JoinColumn({
    name: "parent_uuid",
    referencedColumnName: "uuid",
    foreignKeyConstraintName: "fk_product_categories_parent_uuid",
  })
  parent?: ProductCategoryEntity | null;

  static sort(categories: ProductCategoryEntity[]) {
    return categories.sort((a, b) => ProductCategoryEntity.compare(a, b));
  }

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
