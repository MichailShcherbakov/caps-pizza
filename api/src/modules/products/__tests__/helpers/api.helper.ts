import { Test } from "supertest";
import CategotiesApi from "~/modules/products/modules/categories/__tests__/helpers/api.helper";
import { CreateProductDto, UpdateProductDto } from "../../products.dto";

export default class Api extends CategotiesApi {
  getProducts(): Test {
    return this._handle.get("/products");
  }

  getProduct(uuid: string): Test {
    return this._handle.get(`/products/${uuid}/`);
  }

  createProduct(dto: CreateProductDto): Test {
    return this._handle.post("/products").send(dto);
  }

  updateProduct(uuid: string, dto: UpdateProductDto): Test {
    return this._handle.put(`/products/${uuid}/`).send(dto);
  }

  deleteProduct(uuid: string): Test {
    return this._handle.delete(`/products/${uuid}/`);
  }
}
