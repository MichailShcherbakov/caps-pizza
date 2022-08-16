import { Test } from "supertest";
import { AuthApiHelper } from "../../../auth/__tests__/helpers/api.helper";
import { CreateDeliveryDto, UpdateDeliveryDto } from "../../deliveries.dto";

export default class Api extends AuthApiHelper {
  getDeliveries(): Test {
    return this._handle.get("/deliveries");
  }

  getDelivery(uuid: string): Test {
    return this._handle.get(`/deliveries/${uuid}`);
  }

  createDelivery(dto: CreateDeliveryDto): Test {
    return this._handle
      .post("/deliveries")
      .set("Authorization", `Bearer ${this.accessToken}`)
      .send(dto);
  }

  updateDelivery(uuid: string, dto: UpdateDeliveryDto): Test {
    return this._handle
      .put(`/deliveries/${uuid}`)
      .set("Authorization", `Bearer ${this.accessToken}`)
      .send(dto);
  }

  deleteDelivery(uuid: string): Test {
    return this._handle
      .delete(`/deliveries/${uuid}`)
      .set("Authorization", `Bearer ${this.accessToken}`);
  }
}
