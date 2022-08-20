import { Test } from "supertest";
import { AuthApiHelper } from "~/modules/auth/__tests__/helpers/api.helper";
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from "../../categories.dto";

export default class Api extends AuthApiHelper {
  getProductCategories(): Test {
    return this._handle.get("/products/-/categories");
  }

  getProductCategory(uuid: string): Test {
    return this._handle.get(`/products/-/categories/${uuid}`);
  }

  createProductCategory(dto: CreateProductCategoryDto): Test {
    return this._handle
      .post("/products/-/categories")
      .set("Authorization", `Bearer ${this.accessToken}`)
      .send(dto);
  }

  updateProductCategory(uuid: string, dto: UpdateProductCategoryDto): Test {
    return this._handle
      .put(`/products/-/categories/${uuid}`)
      .set("Authorization", `Bearer ${this.accessToken}`)
      .send(dto);
  }

  deleteProductCategory(uuid: string): Test {
    return this._handle
      .delete(`/products/-/categories/${uuid}`)
      .set("Authorization", `Bearer ${this.accessToken}`);
  }
}
