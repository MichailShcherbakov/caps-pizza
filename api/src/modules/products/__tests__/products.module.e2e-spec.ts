import { faker } from "@faker-js/faker";
import createProductCategoriesHelper from "~/modules/products/modules/categories/__tests__/helpers/create-categories.helper";
import ProductCategoryEntity from "~/db/entities/product-category.entity";
import TestingModule from "./helpers/testing-module.helper";
import createProductsHelper from "./helpers/create-products.helper";
import Api from "./helpers/api.helper";
import { fromJson, toJson } from "~/utils/json.helper";
import { CreateProductDto, UpdateProductDto } from "../products.dto";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/delete-object-props.helper";

describe("[Product Module] ...", () => {
  let testingModule: TestingModule;
  let api: Api;
  let categories: ProductCategoryEntity[] = [];

  beforeAll(async () => {
    testingModule = new TestingModule();

    await testingModule.init();

    api = new Api(testingModule.app);

    await testingModule.clearDataSource();
  });

  beforeEach(async () => {
    categories = await createProductCategoriesHelper(testingModule.dataSource);
  });

  afterEach(async () => {
    await testingModule.clearDataSource();
  });

  afterAll(async () => {
    await testingModule.drop();
  });

  describe("[Get] /products", () => {
    it("should return all exists products", async () => {
      const products = await createProductsHelper(
        testingModule.dataSource,
        categories
      );

      const response = await api.getProducts();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson(
            deleteObjectsPropsHelper(products, ["updated_at", "created_at"])
          )
        ),
      });
    });

    it("should return a special product", async () => {
      const products = await createProductsHelper(
        testingModule.dataSource,
        categories
      );
      const product = products[4];

      const response = await api.getProduct(product.uuid);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson(deleteObjectPropsHelper(product, ["updated_at", "created_at"]))
        ),
      });
    });

    it("should throw an error when getting a non-existing product", async () => {
      const fakeProductUUID = faker.datatype.uuid();

      const response = await api.getProduct(fakeProductUUID);

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The product ${fakeProductUUID} does not exist`,
      });
    });
  });

  describe("[Post] /products", () => {
    it("should successfully create a product", async () => {
      const category = categories[5];
      const dto: CreateProductDto = {
        name: faker.word.noun(),
        article_number: faker.datatype.number(),
        image_url: faker.image.imageUrl(),
        price: faker.datatype.number(),
        category_uuid: category.uuid,
      };

      const response = await api.createProduct(dto);

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        statusCode: 201,
        data: fromJson(
          toJson({
            ...response.body.data,
            ...dto,
          })
        ),
      });
    });

    it("should throw an error when creating a product without a category", async () => {
      const dto: any = {
        name: faker.word.noun(),
        article_number: faker.datatype.number(),
        image_url: faker.image.imageUrl(),
        price: faker.datatype.number(),
      };

      const response = await api.createProduct(dto);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: [
          "category_uuid should not be empty",
          "category_uuid must be a string",
          "category_uuid must be a UUID",
        ],
      });
    });

    it("should throw an error when creating a product with non-exists a category", async () => {
      const dto: CreateProductDto = {
        name: faker.word.noun(),
        article_number: faker.datatype.number(),
        image_url: faker.image.imageUrl(),
        category_uuid: faker.datatype.uuid(),
        price: faker.datatype.number(),
      };

      const response = await api.createProduct(dto);

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The category ${dto.category_uuid} does not exist`,
      });
    });
  });

  describe("[Update] /products", () => {
    it("should successfully update a product", async () => {
      const products = await createProductsHelper(
        testingModule.dataSource,
        categories
      );
      const product = products[3];

      const dto: UpdateProductDto = {
        name: faker.word.noun(),
        image_url: faker.image.imageUrl(),
        price: faker.datatype.number(),
      };

      const response = await api.updateProduct(product.uuid, dto);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson(
            deleteObjectPropsHelper(
              {
                ...product,
                ...dto,
              },
              ["updated_at", "created_at"]
            )
          )
        ),
      });
    });

    it("should successfully update a category of the product", async () => {
      const products = await createProductsHelper(
        testingModule.dataSource,
        categories
      );
      const product = products[3];
      const category = categories[0];

      expect(product.category_uuid).not.toEqual(category.uuid);

      const dto: UpdateProductDto = {
        category_uuid: category.uuid,
        price: faker.datatype.number(),
      };

      const response = await api.updateProduct(product.uuid, dto);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson({
            ...product,
            ...dto,
            updated_at: undefined,
            created_at: undefined,
          })
        ),
      });
    });

    it("should throw an error when update a non-exists category of the product", async () => {
      const products = await createProductsHelper(
        testingModule.dataSource,
        categories
      );
      const product = products[3];
      const fakeCategoryUUID = faker.datatype.uuid();

      const dto: UpdateProductDto = {
        category_uuid: fakeCategoryUUID,
        price: faker.datatype.number(),
      };

      const response = await api.updateProduct(product.uuid, dto);

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The category ${fakeCategoryUUID} does not exist`,
      });
    });
  });

  describe("[Delete] /products/categories", () => {
    it("should successfully delete a category that already has a products", async () => {
      const products = await createProductsHelper(
        testingModule.dataSource,
        categories
      );
      const product = products[3];
      const category = categories[3];

      expect(product.category_uuid).toEqual(category.uuid);

      const deleteCategoryResponse = await api.deleteProductCategory(
        category.uuid
      );

      expect(deleteCategoryResponse.status).toEqual(200);
      expect(deleteCategoryResponse.body).toEqual({
        statusCode: 200,
      });

      const getProductResponse = await api.getProduct(product.uuid);

      expect(getProductResponse.status).toEqual(404);
      expect(getProductResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The product ${product.uuid} does not exist`,
      });
    });
  });

  describe("[Delete] /products", () => {
    it("should successfully delete a product", async () => {
      const products = await createProductsHelper(
        testingModule.dataSource,
        categories
      );
      const product = products[3];

      const deleteProductResponse = await api.deleteProduct(product.uuid);

      expect(deleteProductResponse.status).toEqual(200);
      expect(deleteProductResponse.body).toEqual({
        statusCode: 200,
      });

      const getProductResponse = await api.getProduct(product.uuid);

      expect(getProductResponse.status).toEqual(404);
      expect(getProductResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The product ${product.uuid} does not exist`,
      });
    });
  });
});
