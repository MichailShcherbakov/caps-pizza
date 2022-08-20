import { Test } from "supertest";
import { CreateModifierDto, UpdateModifierDto } from "../../modifiers.dto";
import ModifierCategoryApi from "../../modules/categories/__tests__/helpers/api.helper";

export default class Api extends ModifierCategoryApi {
  getModifiers(): Test {
    return this._handle.get("/modifiers");
  }

  getModifier(uuid: string): Test {
    return this._handle.get(`/modifiers/${uuid}`);
  }

  createModifier(dto: CreateModifierDto): Test {
    return this._handle
      .post("/modifiers")
      .set("Authorization", `Bearer ${this.accessToken}`)
      .send(dto);
  }

  updateModifier(uuid: string, dto: UpdateModifierDto): Test {
    return this._handle
      .put(`/modifiers/${uuid}`)
      .set("Authorization", `Bearer ${this.accessToken}`)
      .send(dto);
  }

  deleteModifier(uuid: string): Test {
    return this._handle
      .delete(`/modifiers/${uuid}`)
      .set("Authorization", `Bearer ${this.accessToken}`);
  }
}
