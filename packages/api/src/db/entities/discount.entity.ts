import { Column, Entity, OneToMany } from "typeorm";
import IEntity from "./entity.interface";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
  IDiscount,
} from "@monorepo/common";
import DiscountStrategyEntity from "./discount-strategy.entity";

export { DiscountCriteriaEnum, DiscountOperatorEnum, DiscountTypeEnum };

@Entity("discounts")
export default class DiscountEntity extends IEntity implements IDiscount {
  @Column({ unique: true })
  name: string;

  @Column({ type: "varchar" })
  type: DiscountTypeEnum;

  @Column({ type: "float4" })
  value: number;

  @OneToMany(() => DiscountStrategyEntity, strategy => strategy.discount, {
    onDelete: "CASCADE",
  })
  strategies: DiscountStrategyEntity[];

  static compare(a?: DiscountEntity, b?: DiscountEntity): number {
    if (!a && b) return 1;
    else if (a && !b) return -1;
    else if (!a || !b) return 0;
    else if (a.name < b.name) return -1;
    else if (a.name > b.name) return 1;
    return 0;
  }
}
