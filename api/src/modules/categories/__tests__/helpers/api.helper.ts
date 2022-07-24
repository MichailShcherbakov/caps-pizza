import { Test } from "supertest";
import IApi from "~/utils/api.interface";
import { CreateCategoryDto } from "../../categories.dto";

export class Api extends IApi {
  getCategories(): Test {
    return this.handle.get("/categories");
  }

  getCategory(uuid: string): Test {
    return this.handle.get(`/categories/${uuid}`);
  }

  createCategory(dto: CreateCategoryDto): Test {
    return this.handle.post("/categories").send(dto);
  }

  deleteCategory(uuid: string): Test {
    return this.handle.delete(`/category/${uuid}`);
  }
}

export default Api;
