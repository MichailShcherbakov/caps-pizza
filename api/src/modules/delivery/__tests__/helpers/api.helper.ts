import { Test } from "supertest";
import IApi from "~/utils/api.interface";
import { CreateDeliveryDto, UpdateDeliveryDto } from "../../deliveries.dto";

export default class Api extends IApi {
  getDeliveries(): Test {
    return this._handle.get("/deliveries");
  }

  getDelivery(uuid: string): Test {
    return this._handle.get(`/deliveries/${uuid}`);
  }

  createDelivery(dto: CreateDeliveryDto): Test {
    return this._handle.post("/deliveries").send(dto);
  }

  updateDelivery(uuid: string, dto: UpdateDeliveryDto): Test {
    return this._handle.put(`/deliveries/${uuid}`).send(dto);
  }

  deleteDelivery(uuid: string): Test {
    return this._handle.delete(`/deliveries/${uuid}`);
  }
}
