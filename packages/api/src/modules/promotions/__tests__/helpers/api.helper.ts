import { Test } from "supertest";
import { AuthApiHelper } from "~/modules/auth/__tests__/helpers/api.helper";
import { CreatePromotionDto, UpdatePromotionDto } from "../../promotions.dto";

export default class Api extends AuthApiHelper {
  getPromotions(): Test {
    return this._handle.get("/promotions");
  }

  getPromotion(uuid: string): Test {
    return this._handle.get(`/promotions/${uuid}`);
  }

  createPromotion(dto: CreatePromotionDto): Test {
    return this._handle
      .post("/promotions")
      .set("Authorization", `Bearer ${this.accessToken}`)
      .send(dto);
  }

  updatePromotion(uuid: string, dto: UpdatePromotionDto): Test {
    return this._handle
      .put(`/promotions/${uuid}`)
      .set("Authorization", `Bearer ${this.accessToken}`)
      .send(dto);
  }

  deletePromotion(uuid: string): Test {
    return this._handle
      .delete(`/promotions/${uuid}`)
      .set("Authorization", `Bearer ${this.accessToken}`);
  }
}
