import { faker } from "@faker-js/faker";
import { fromJson, toJson } from "~/utils/json.helper";
import CategoryEntity from "~/db/entities/category.entity";
import createCategoriesHelper, {
  createCategoryHelper,
} from "./helpers/create-categories.helper";
import Api from "./helpers/api.helper";
import TestingModule from "./helpers/testing-module.helper";

describe("[Categories Module] ... ", () => {
  let testingModule: TestingModule;
  let api: Api;

  beforeAll(async () => {
    testingModule = new TestingModule();
    await testingModule.init();

    api = new Api(testingModule.app);

    await testingModule.clearDataSource();
  });

  afterEach(async () => {
    await testingModule.clearDataSource();
  });

  afterAll(async () => {
    await testingModule.drop();
  });

  describe("[Get] /categories", () => {
    let categories: CategoryEntity[];

    beforeEach(async () => {
      categories = await createCategoriesHelper(testingModule.dataSource);
    });

    it("should return all exists categories", async () => {
      const response = await api.getCategories();

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        statusCode: 200,
        data: fromJson(toJson(categories)),
      });
    });

    it("should return a special category", async () => {
      const category = categories[2];
      const response = await api.getCategory(category.uuid);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        statusCode: 200,
        data: fromJson(toJson(category)),
      });
    });
  });

  describe("[Post] /categories", () => {
    it("should successfully create a category", async () => {
      const dto = {
        name: faker.commerce.productName(),
        image_url: faker.image.imageUrl(),
      };

      const response = await api.createCategory(dto);

      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({
        statusCode: 201,
        data: {
          ...response.body.data,
          ...dto,
        },
      });
    });

    it("should throw an error when creating a category without image_url", async () => {
      const dto = {
        name: faker.commerce.productName(),
      };

      const response = await api.createCategory(dto as any);

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: [
          "image_url should not be empty",
          "image_url must be a string",
        ],
      });
    });

    it("should throw an error when creating a category without name", async () => {
      const dto = {
        image_url: faker.image.imageUrl(),
      };

      const response = await api.createCategory(dto as any);

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: ["name should not be empty", "name must be a string"],
      });
    });
  });

  describe("[Delete] /categories", () => {
    it("should successfully delete a category", async () => {
      const category = await createCategoryHelper(testingModule.dataSource);

      const response = await api.deleteCategory(category.uuid);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        statusCode: 200,
      });

      const responseGetCategory = await api.getCategory(category.uuid);

      expect(responseGetCategory.statusCode).toEqual(404);
      expect(responseGetCategory.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The category ${category.uuid} does not exist`,
      });
    });
  });
});
