import { Test } from "supertest";
import IApi from "~/utils/api.interface";
import {
  CreateModifierCategoryDto,
  UpdateModifierCategoryDto,
} from "../../categories.dto";

export default class Api extends IApi {
  getModifierCategories(): Test {
    return this._handle.get("/modifiers/-/categories");
  }

  getModifierCategory(uuid: string): Test {
    return this._handle.get(`/modifiers/-/categories/${uuid}`);
  }

  createModifierCategory(dto: CreateModifierCategoryDto): Test {
    return this._handle.post("/modifiers/-/categories").send(dto);
  }

  updateModifierCategory(uuid: string, dto: UpdateModifierCategoryDto): Test {
    return this._handle.put(`/modifiers/-/categories/${uuid}`).send(dto);
  }

  deleteModifierCategory(uuid: string): Test {
    return this._handle.delete(`/modifiers/-/categories/${uuid}`);
  }
}
