import { Test } from "supertest";
import {
  CreateModifierCategoryDto,
  UpdateModifierCategoryDto,
} from "../../categories.dto";
import { AuthApiHelper } from "~/modules/auth/__tests__/helpers/api.helper";

export default class Api extends AuthApiHelper {
  getModifierCategories(): Test {
    return this._handle.get("/modifiers/-/categories");
  }

  getModifierCategory(uuid: string): Test {
    return this._handle.get(`/modifiers/-/categories/${uuid}`);
  }

  createModifierCategory(dto: CreateModifierCategoryDto): Test {
    return this._handle
      .post("/modifiers/-/categories")
      .set("Authorization", `Bearer ${this.accessToken}`)
      .send(dto);
  }

  updateModifierCategory(uuid: string, dto: UpdateModifierCategoryDto): Test {
    return this._handle
      .put(`/modifiers/-/categories/${uuid}`)
      .set("Authorization", `Bearer ${this.accessToken}`)
      .send(dto);
  }

  deleteModifierCategory(uuid: string): Test {
    return this._handle
      .delete(`/modifiers/-/categories/${uuid}`)
      .set("Authorization", `Bearer ${this.accessToken}`);
  }
}
