import { faker } from "@faker-js/faker";
import { fromJson, toJson } from "~/utils/__tests__/helpers/json.helper";
import ProductCategoryEntity from "~/db/entities/product-category.entity";
import createProductCategoriesHelper, {
  createProductCategoryHelper,
} from "./helpers/create-categories.helper";
import Api from "./helpers/api.helper";
import TestingModule from "./helpers/testing-module.helper";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/__tests__/helpers/delete-object-props.helper";
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from "../categories.dto";
import ProductCategoriesService from "../categories.service";

describe("[Product Categories Module] ... ", () => {
  let testingModule: TestingModule;
  let api: Api;

  beforeAll(async () => {
    testingModule = new TestingModule();
    await testingModule.init();

    api = new Api(testingModule.app);

    await api.init();
  });

  afterEach(async () => {
    await testingModule.clearDataSource();
  });

  afterAll(async () => {
    await testingModule.drop();
  });

  describe("[Get] /products/categories", () => {
    let productCategories: ProductCategoryEntity[];

    beforeEach(async () => {
      productCategories = await createProductCategoriesHelper(testingModule);
    });

    it("should return all exists product categories", async () => {
      const getProductCategoriesResponse = await api.getProductCategories();

      expect(getProductCategoriesResponse.statusCode).toEqual(200);
      expect(getProductCategoriesResponse.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson(
            deleteObjectsPropsHelper(
              ProductCategoriesService.sort(productCategories),
              ["updated_at", "created_at"]
            )
          )
        ),
      });
    });

    it("should return a special product category", async () => {
      const productCategory = productCategories[2];
      const getProductCategoryResponse = await api.getProductCategory(
        productCategory.uuid
      );

      expect(getProductCategoryResponse.statusCode).toEqual(200);
      expect(getProductCategoryResponse.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson(
            deleteObjectPropsHelper(productCategory, [
              "updated_at",
              "created_at",
            ])
          )
        ),
      });
    });
  });

  describe("[Post] /products/categories", () => {
    it("should successfully create a product category", async () => {
      const dto: CreateProductCategoryDto = {
        name: faker.commerce.productName(),
        image_url: faker.image.imageUrl(),
        display_position: faker.datatype.number(),
      };

      const createProductCategoryResponse = await api.createProductCategory(
        dto
      );

      expect(createProductCategoryResponse.statusCode).toEqual(201);
      expect(createProductCategoryResponse.body).toEqual({
        statusCode: 201,
        data: {
          ...createProductCategoryResponse.body.data,
          ...dto,
        },
      });
    });

    it("should throw an error when creating a product category without image_url", async () => {
      const dto: Partial<CreateProductCategoryDto> = {
        name: faker.commerce.productName(),
        display_position: faker.datatype.number(),
      };

      const createProductCategoryResponse = await api.createProductCategory(
        dto as CreateProductCategoryDto
      );

      expect(createProductCategoryResponse.statusCode).toEqual(400);
      expect(createProductCategoryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: [
          "image_url should not be empty",
          "image_url must be a string",
        ],
      });
    });

    it("should throw an error when creating a product category without name", async () => {
      const dto: Partial<CreateProductCategoryDto> = {
        image_url: faker.image.imageUrl(),
        display_position: faker.datatype.number(),
      };

      const createProductCategoryResponse = await api.createProductCategory(
        dto as CreateProductCategoryDto
      );

      expect(createProductCategoryResponse.statusCode).toEqual(400);
      expect(createProductCategoryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: ["name should not be empty", "name must be a string"],
      });
    });

    it("should throw an error when creating a product category with exists name", async () => {
      const otherProductCategory = await createProductCategoryHelper(
        testingModule
      );

      const dto: CreateProductCategoryDto = {
        name: otherProductCategory.name,
        image_url: faker.image.imageUrl(),
        display_position: faker.datatype.number(),
      };

      const createProductCategoryResponse = await api.createProductCategory(
        dto
      );

      expect(createProductCategoryResponse.statusCode).toEqual(400);
      expect(createProductCategoryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The product category with ${otherProductCategory.name} name already exists`,
      });
    });
  });

  describe("[Put] /products/categories", () => {
    it("should successfully update a product category", async () => {
      const initialProductCategory = await createProductCategoryHelper(
        testingModule
      );

      const dto: UpdateProductCategoryDto = {
        name: faker.commerce.productName(),
        image_url: faker.image.imageUrl(),
        display_position: faker.datatype.number(),
      };

      const createProductCategoryResponse = await api.updateProductCategory(
        initialProductCategory.uuid,
        dto
      );

      expect(createProductCategoryResponse.statusCode).toEqual(200);
      expect(createProductCategoryResponse.body).toEqual({
        statusCode: 200,
        data: {
          ...createProductCategoryResponse.body.data,
          ...dto,
        },
      });
    });

    it("should throw an error when updating a non-exists product category", async () => {
      const fakeProductCategoryUUID = faker.datatype.uuid();

      const dto: UpdateProductCategoryDto = {
        name: faker.commerce.productName(),
        image_url: faker.image.imageUrl(),
        display_position: faker.datatype.number(),
      };

      const createProductCategoryResponse = await api.updateProductCategory(
        fakeProductCategoryUUID,
        dto
      );

      expect(createProductCategoryResponse.statusCode).toEqual(404);
      expect(createProductCategoryResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The product category ${fakeProductCategoryUUID} does not exist`,
      });
    });

    it("should throw an error when updating a product category with exists name", async () => {
      const initialProductCategory = await createProductCategoryHelper(
        testingModule
      );
      const otherProductCategory = await createProductCategoryHelper(
        testingModule
      );

      const dto: UpdateProductCategoryDto = {
        name: otherProductCategory.name,
      };

      const createProductCategoryResponse = await api.updateProductCategory(
        initialProductCategory.uuid,
        dto
      );

      expect(createProductCategoryResponse.statusCode).toEqual(400);
      expect(createProductCategoryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The product category with ${otherProductCategory.name} name already exists`,
      });
    });
  });

  describe("[Delete] /products/categories", () => {
    it("should successfully delete a product category", async () => {
      const productCategory = await createProductCategoryHelper(testingModule);

      const deleteProductCategoryResponse = await api.deleteProductCategory(
        productCategory.uuid
      );

      expect(deleteProductCategoryResponse.statusCode).toEqual(200);
      expect(deleteProductCategoryResponse.body).toEqual({
        statusCode: 200,
      });

      const getProductCategoryResponse = await api.getProductCategory(
        productCategory.uuid
      );

      expect(getProductCategoryResponse.statusCode).toEqual(404);
      expect(getProductCategoryResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The product category ${productCategory.uuid} does not exist`,
      });
    });

    it("should throw an error when deleting a non-existing product category", async () => {
      const fakeProductCategoryUUID = faker.datatype.uuid();

      const deleteProductCategoryResponse = await api.deleteProductCategory(
        fakeProductCategoryUUID
      );

      expect(deleteProductCategoryResponse.statusCode).toEqual(404);
      expect(deleteProductCategoryResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The product category ${fakeProductCategoryUUID} does not exist`,
      });
    });
  });
});
