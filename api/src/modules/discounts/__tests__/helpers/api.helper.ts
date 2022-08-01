import { Test } from "supertest";
import IApi from "~/utils/api.interface";
import { CreateDiscountDto } from "../../discounts.dto";

export default class Api extends IApi {
  getDiscounts(): Test {
    return this._handle.get("/discounts");
  }

  getDiscount(uuid: string): Test {
    return this._handle.get(`/discounts/${uuid}`);
  }

  createDiscount(dto: CreateDiscountDto): Test {
    return this._handle.post("/discounts").send(dto);
  }

  deleteDiscount(uuid: string): Test {
    return this._handle.delete(`/discounts/${uuid}`);
  }
}
