import { Test } from "supertest";
import ProductCategotiesApi from "../../modules/categories/__tests__/helpers/api.helper";
import { CreateProductDto, UpdateProductDto } from "../../products.dto";

export default class Api extends ProductCategotiesApi {
  getProducts(): Test {
    return this._handle.get("/products");
  }

  getProduct(uuid: string): Test {
    return this._handle.get(`/products/${uuid}`);
  }

  createProduct(dto: CreateProductDto): Test {
    return this._handle
      .post("/products")
      .set("Authorization", `Bearer ${this.accessToken}`)
      .send(dto);
  }

  updateProduct(uuid: string, dto: UpdateProductDto): Test {
    return this._handle
      .put(`/products/${uuid}`)
      .set("Authorization", `Bearer ${this.accessToken}`)
      .send(dto);
  }

  deleteProduct(uuid: string): Test {
    return this._handle
      .delete(`/products/${uuid}`)
      .set("Authorization", `Bearer ${this.accessToken}`);
  }
}
