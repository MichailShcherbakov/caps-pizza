import { Column, Entity } from "typeorm";
import { IPromotion } from "@monorepo/common";
import IEntity from "./entity.interface";

@Entity("promotions")
export default class PromotionEntity extends IEntity implements IPromotion {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  image_url: string;

  @Column()
  display: boolean;

  @Column()
  display_position: number;

  static compare(a?: PromotionEntity, b?: PromotionEntity): number {
    if (!a && b) return 1;
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
