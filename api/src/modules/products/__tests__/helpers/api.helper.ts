import { Test } from "supertest";
import CategotiesApi from "~/modules/categories/__tests__/helpers/api.helper";
import { CreateProductDto, UpdateProductDto } from "../../products.dto";

export class Api extends CategotiesApi {
  getProducts(): Test {
    return this.handle.get("/products");
  }

  getProduct(uuid: string): Test {
    return this.handle.get(`/products/${uuid}`);
  }

  createProduct(dto: CreateProductDto): Test {
    return this.handle.post("/products").send(dto);
  }

  updateProduct(uuid: string, dto: UpdateProductDto): Test {
    return this.handle.put(`/products/${uuid}`).send(dto);
  }

  deleteProduct(uuid: string): Test {
    return this.handle.delete(`/products/${uuid}`);
  }
}

export default Api;
