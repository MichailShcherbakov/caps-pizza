import { Test } from "supertest";
import IApi from "~/utils/api.interface";
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from "../../categories.dto";

export default class Api extends IApi {
  getProductCategories(): Test {
    return this._handle.get("/products/-/categories");
  }

  getProductCategory(uuid: string): Test {
    return this._handle.get(`/products/-/categories/${uuid}`);
  }

  createProductCategory(dto: CreateProductCategoryDto): Test {
    return this._handle.post("/products/-/categories").send(dto);
  }

  updateProductCategory(uuid: string, dto: UpdateProductCategoryDto): Test {
    return this._handle.put(`/products/-/categories/${uuid}`).send(dto);
  }

  deleteProductCategory(uuid: string): Test {
    return this._handle.delete(`/products/-/categories/${uuid}`);
  }
}
