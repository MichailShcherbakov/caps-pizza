import { Test } from "supertest";
import IApi from "~/utils/api.interface";
import { MakeAnOrderDto } from "../../orders.dto";

export default class Api extends IApi {
  makeAnOrder(dto: MakeAnOrderDto): Test {
    return this._handle.post("/orders").send(dto);
  }
}
