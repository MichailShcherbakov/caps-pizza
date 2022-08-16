import { Test } from "supertest";
import { AuthApiHelper } from "../../../auth/__tests__/helpers/api.helper";
import { CreateDiscountDto, UpdateDiscountDto } from "../../discounts.dto";

export default class Api extends AuthApiHelper {
  getDiscounts(): Test {
    return this._handle.get("/discounts");
  }

  getDiscount(uuid: string): Test {
    return this._handle.get(`/discounts/${uuid}`);
  }

  createDiscount(dto: CreateDiscountDto): Test {
    return this._handle
      .post("/discounts")
      .set("Authorization", `Bearer ${this.accessToken}`)
      .send(dto);
  }

  updateDiscount(uuid: string, dto: UpdateDiscountDto): Test {
    return this._handle
      .put(`/discounts/${uuid}`)
      .set("Authorization", `Bearer ${this.accessToken}`)
      .send(dto);
  }

  deleteDiscount(uuid: string): Test {
    return this._handle
      .delete(`/discounts/${uuid}`)
      .set("Authorization", `Bearer ${this.accessToken}`);
  }
}
