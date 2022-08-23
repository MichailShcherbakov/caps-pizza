import { Test } from "supertest";
import { AuthApiHelper } from "../../../auth/__tests__/helpers/api.helper";
import { CreatePaymentDto, UpdatePaymentDto } from "../../orders.dto";

export default class Api extends AuthApiHelper {
  getPayments(): Test {
    return this._handle.get("/payments");
  }

  getPayment(uuid: string): Test {
    return this._handle.get(`/payments/${uuid}`);
  }

  createPayment(dto: CreatePaymentDto): Test {
    return this._handle
      .post("/payments")
      .set("Authorization", `Bearer ${this.accessToken}`)
      .send(dto);
  }

  updatePayment(uuid: string, dto: UpdatePaymentDto): Test {
    return this._handle
      .put(`/payments/${uuid}`)
      .set("Authorization", `Bearer ${this.accessToken}`)
      .send(dto);
  }

  deletePayment(uuid: string): Test {
    return this._handle
      .delete(`/payments/${uuid}`)
      .set("Authorization", `Bearer ${this.accessToken}`);
  }
}
