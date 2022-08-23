import IEntity from "./entity.interface";

export interface IPayment extends IEntity {
  name: string;
  code: number;
}

export default IPayment;
