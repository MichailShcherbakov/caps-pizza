import { Column, Entity } from "typeorm";
import { IPayment } from "@monorepo/common";
import IEntity from "./entity.inteface";

@Entity("payments")
export default class PaymentEntity extends IEntity implements IPayment {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: number;

  static compare(a?: PaymentEntity, b?: PaymentEntity): number {
    if (!a && b) return 1;
    else if (a && !b) return -1;
    else if (!a || !b) return 0;
    return a.code - b.code;
  }
}
