import { faker } from "@faker-js/faker";
import createProductCategoriesHelper from "~/modules/products/modules/categories/__tests__/helpers/create-categories.helper";
import ProductCategoryEntity from "~/db/entities/product-category.entity";
import TestingModule from "./helpers/testing-module.helper";
import createProductsHelper, {
  createProductHelper,
} from "./helpers/create-products.helper";
import Api from "./helpers/api.helper";
import { CreateProductDto, UpdateProductDto } from "../products.dto";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/delete-object-props.helper";
import ModifierEntity from "~/db/entities/modifier.entity";
import createModifiersHelper, {
  createModifierHelper,
} from "~/modules/modifiers/__tests__/helpers/create-modifiers.helper";
import createModifierCategoriesHelper from "~/modules/modifiers/modules/categories/__tests__/helpers/create-modifier-categories.helper";
import ModifierCategoryEntity from "~/db/entities/modifier-category.entity";
import ProductsService from "../products.service";
import ModifiersService from "~/modules/modifiers/modifiers.service";
import {
  ProductVolumeTypeEnum,
  ProductWeightTypeEnum,
} from "~/db/entities/product.entity";

describe("[Product Module] ...", () => {
  let testingModule: TestingModule;
  let api: Api;
  let categories: ProductCategoryEntity[] = [];
  let modifiers: ModifierEntity[] = [];

  beforeAll(async () => {
    testingModule = new TestingModule();

    await testingModule.init();

    api = new Api(testingModule.app);

    await api.init();

    modifiers = await createModifiersHelper(
      testingModule,
      await createModifierCategoriesHelper(testingModule)
    );
    categories = await createProductCategoriesHelper(testingModule);
  });

  afterEach(async () => {
    await testingModule.clearDataSource();
  });

  afterAll(async () => {
    await testingModule.drop();
  });

  describe("[Get] /products", () => {
    it("should return all exists products", async () => {
      const products = await createProductsHelper(testingModule, categories);

      const getProductsResponse = await api.getProducts();

      expect(getProductsResponse.status).toEqual(200);
      expect(getProductsResponse.body).toEqual({
        statusCode: 200,
        data: deleteObjectsPropsHelper(ProductsService.sort(products), [
          "updated_at",
          "created_at",
        ]),
      });
    });

    it("should return a special product", async () => {
      const product = await createProductHelper(testingModule, categories[2]);

      const getProductResponse = await api.getProduct(product.uuid);

      expect(getProductResponse.status).toEqual(200);
      expect(getProductResponse.body).toEqual({
        statusCode: 200,
        data: deleteObjectPropsHelper(product, ["updated_at", "created_at"]),
      });
    });

    it("should throw an error when getting a non-existing product", async () => {
      const fakeProductUUID = faker.datatype.uuid();

      const getProductResponse = await api.getProduct(fakeProductUUID);

      expect(getProductResponse.status).toEqual(404);
      expect(getProductResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The product ${fakeProductUUID} does not exist`,
      });
    });
  });

  describe("[Post] /products", () => {
    it("should successfully create a product", async () => {
      const category = categories[5];
      const choisedModifiers = [modifiers[2], modifiers[6]];

      const dto: CreateProductDto = {
        name: faker.datatype.string(),
        desc: faker.datatype.string(),
        article_number: faker.datatype.number(),
        image_url: faker.image.imageUrl(),
        price: faker.datatype.number(),
        category_uuid: category.uuid,
        modifiers_uuids: choisedModifiers.map(m => m.uuid),
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 4,
        },
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 200,
        },
        tags: ["first:1", "second:2"],
      };

      const createProductResponse = await api.createProduct(dto);

      expect(createProductResponse.status).toEqual(201);
      expect(createProductResponse.body).toEqual({
        statusCode: 201,
        data: {
          uuid: createProductResponse.body.data.uuid,
          category: deleteObjectPropsHelper(category, [
            "updated_at",
            "created_at",
          ]),
          modifiers: deleteObjectsPropsHelper(
            ModifiersService.sort(choisedModifiers),
            ["updated_at", "created_at"]
          ),
          ...deleteObjectPropsHelper(dto, ["modifiers_uuids"]),
        },
      });
    });

    it("should throw an error when creating a product without a category", async () => {
      const dto: Omit<CreateProductDto, "category_uuid"> = {
        name: faker.datatype.string(),
        article_number: faker.datatype.number(),
        image_url: faker.image.imageUrl(),
        price: faker.datatype.number(),
        modifiers_uuids: [],
      };

      const createProductResponse = await api.createProduct(
        dto as CreateProductDto
      );

      expect(createProductResponse.status).toEqual(400);
      expect(createProductResponse.body).toEqual({
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
        name: faker.datatype.string(),
        article_number: faker.datatype.number(),
        image_url: faker.image.imageUrl(),
        category_uuid: faker.datatype.uuid(),
        price: faker.datatype.number(),
        modifiers_uuids: [],
      };

      const createProductResponse = await api.createProduct(dto);

      expect(createProductResponse.status).toEqual(404);
      expect(createProductResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The category ${dto.category_uuid} does not exist`,
      });
    });

    it("should throw an error when creating product with non-exists modifier", async () => {
      const category = categories[1];
      const modifierFakerUUID = faker.datatype.uuid();

      const dto: CreateProductDto = {
        name: faker.datatype.string(),
        article_number: faker.datatype.number(),
        image_url: faker.image.imageUrl(),
        category_uuid: category.uuid,
        price: faker.datatype.number(),
        modifiers_uuids: [modifierFakerUUID],
      };

      const createProductResponse = await api.createProduct(dto);

      expect(createProductResponse.status).toEqual(404);
      expect(createProductResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The modifier ${modifierFakerUUID} does not exist`,
      });
    });

    it("should throw an error when creating product with modifier with equal type", async () => {
      const category = categories[4];

      const modifier = modifiers[0];
      const sameModifier = await createModifierHelper(
        testingModule,
        modifier.category as ModifierCategoryEntity
      );

      const modifiers_uuids = [modifier.uuid, sameModifier.uuid];

      const dto: CreateProductDto = {
        name: faker.datatype.string(),
        article_number: faker.datatype.number(),
        image_url: faker.image.imageUrl(),
        category_uuid: category.uuid,
        price: faker.datatype.number(),
        modifiers_uuids,
      };

      const createProductResponse = await api.createProduct(dto);

      expect(createProductResponse.status).toEqual(400);
      expect(createProductResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The product must not have several modifiers the one ${modifiers[0].category?.name} category`,
      });
    });

    it("should throw an error when creating product with already exists product article number", async () => {
      const category = categories[2];
      const otherCategory = categories[4];
      const otherProduct = await createProductHelper(
        testingModule,
        otherCategory
      );

      const dto: CreateProductDto = {
        name: faker.datatype.string(),
        article_number: otherProduct.article_number,
        image_url: faker.image.imageUrl(),
        category_uuid: category.uuid,
        price: faker.datatype.number(),
        modifiers_uuids: [],
      };

      const createProductResponse = await api.createProduct(dto);

      expect(createProductResponse.status).toEqual(400);
      expect(createProductResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The product ${otherProduct.uuid} already has the article number`,
      });
    });

    it("should throw an error when creating product with already exists modifier article number", async () => {
      const category = categories[2];
      const modifier = modifiers[2];

      const dto: CreateProductDto = {
        name: faker.datatype.string(),
        article_number: modifier.article_number,
        image_url: faker.image.imageUrl(),
        category_uuid: category.uuid,
        price: faker.datatype.number(),
        modifiers_uuids: [],
      };

      const createProductResponse = await api.createProduct(dto);

      expect(createProductResponse.status).toEqual(400);
      expect(createProductResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The modifier ${modifier.uuid} already has the article number`,
      });
    });
  });

  describe("[Put] /products", () => {
    it("should successfully update a product", async () => {
      const category = categories[1];
      const otherCategory = categories[1];
      const product = await createProductHelper(testingModule, category);
      const newModifiers = [modifiers[1], modifiers[3]];

      const dto: UpdateProductDto = {
        name: faker.datatype.string(),
        image_url: faker.image.imageUrl(),
        price: faker.datatype.number(),
        article_number: faker.datatype.number(),
        desc: faker.datatype.string(),
        category_uuid: otherCategory.uuid,
        modifiers_uuids: newModifiers.map(m => m.uuid),
        weight: {
          type: ProductWeightTypeEnum.GRAMS,
          value: 250,
        },
        volume: {
          type: ProductVolumeTypeEnum.QUANTITY,
          value: 2,
        },
        tags: ["first:1", "second:2"],
      };

      const response = await api.updateProduct(product.uuid, dto);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        statusCode: 200,
        data: deleteObjectPropsHelper(
          {
            ...product,
            ...dto,
            modifiers: deleteObjectsPropsHelper(
              ModifiersService.sort(newModifiers),
              ["updated_at", "created_at"]
            ),
          },
          ["updated_at", "created_at", "modifiers_uuids"]
        ),
      });
    });

    it("should successfully updating the product with the same unique props", async () => {
      const category = categories[1];
      const product = await createProductHelper(testingModule, category);

      const dto: UpdateProductDto = {
        name: product.name,
        image_url: faker.image.imageUrl(),
        price: faker.datatype.number(),
        article_number: product.article_number,
        desc: faker.datatype.string(),
        category_uuid: category.uuid,
      };

      const response = await api.updateProduct(product.uuid, dto);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        statusCode: 200,
        data: deleteObjectPropsHelper(
          {
            ...product,
            ...dto,
          },
          ["updated_at", "created_at"]
        ),
      });
    });

    it("should successfully update a category of the product", async () => {
      const category = categories[0];
      const otherCategory = categories[2];
      const product = await createProductHelper(testingModule, category);

      const dto: UpdateProductDto = {
        category_uuid: otherCategory.uuid,
      };

      const updateProductResponse = await api.updateProduct(product.uuid, dto);

      expect(updateProductResponse.status).toEqual(200);
      expect(updateProductResponse.body).toEqual({
        statusCode: 200,
        data: deleteObjectPropsHelper(
          {
            ...product,
            ...dto,
          },
          ["updated_at", "created_at"]
        ),
      });
    });

    it("should throw an error when update a non-exists product", async () => {
      const fakeProductUUID = faker.datatype.uuid();

      const dto: UpdateProductDto = {
        price: faker.datatype.number(),
      };

      const updateProductResponse = await api.updateProduct(
        fakeProductUUID,
        dto
      );

      expect(updateProductResponse.status).toEqual(404);
      expect(updateProductResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The product ${fakeProductUUID} does not exist`,
      });
    });

    it("should throw an error when update a non-exists category of the product", async () => {
      const category = categories[3];
      const product = await createProductHelper(testingModule, category);
      const fakeCategoryUUID = faker.datatype.uuid();

      const dto: UpdateProductDto = {
        category_uuid: fakeCategoryUUID,
        price: faker.datatype.number(),
      };

      const updateProductResponse = await api.updateProduct(product.uuid, dto);

      expect(updateProductResponse.status).toEqual(404);
      expect(updateProductResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The category ${fakeCategoryUUID} does not exist`,
      });
    });

    it("should throw an error when updating product with non-exists modifier", async () => {
      const category = categories[1];
      const product = await createProductHelper(testingModule, category);
      const modifierFakerUUID = faker.datatype.uuid();

      const dto: UpdateProductDto = {
        modifiers_uuids: [modifierFakerUUID],
      };

      const updateProductResponse = await api.updateProduct(product.uuid, dto);

      expect(updateProductResponse.status).toEqual(404);
      expect(updateProductResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The modifier ${modifierFakerUUID} does not exist`,
      });
    });

    it("should throw an error when creating product with modifier with equal type", async () => {
      const category = categories[1];
      const product = await createProductHelper(testingModule, category);

      const modifier = modifiers[0];
      const sameModifier = await createModifierHelper(
        testingModule,
        modifier.category as ModifierCategoryEntity
      );

      const modifiers_uuids = [modifier, sameModifier].map(m => m.uuid);

      const dto: UpdateProductDto = {
        modifiers_uuids,
      };

      const updateProductResponse = await api.updateProduct(product.uuid, dto);

      expect(updateProductResponse.status).toEqual(400);
      expect(updateProductResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The product must not have several modifiers the one ${modifiers[0].category?.name} category`,
      });
    });

    it("should throw an error when creating product with already exists product article number", async () => {
      const otherCategory = categories[4];
      const otherProduct = await createProductHelper(
        testingModule,
        otherCategory
      );

      const category = categories[2];
      const product = await createProductHelper(testingModule, category);

      const dto: UpdateProductDto = {
        article_number: otherProduct.article_number,
      };

      const updateProductResponse = await api.updateProduct(product.uuid, dto);

      expect(updateProductResponse.status).toEqual(400);
      expect(updateProductResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The product ${otherProduct.uuid} already has the article number`,
      });
    });

    it("should throw an error when creating product with already exists modifier article number", async () => {
      const modifier = modifiers[2];

      const category = categories[2];
      const product = await createProductHelper(testingModule, category);

      const dto: UpdateProductDto = {
        article_number: modifier.article_number,
      };

      const updateProductResponse = await api.updateProduct(product.uuid, dto);

      expect(updateProductResponse.status).toEqual(400);
      expect(updateProductResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The modifier ${modifier.uuid} already has the article number`,
      });
    });
  });

  describe("[Delete] /products/categories", () => {
    it("should successfully delete a category that already has a products", async () => {
      const category = categories[3];
      const product = await createProductHelper(testingModule, category);

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

      categories = categories.filter(c => c.uuid !== category.uuid);
    });
  });

  describe("[Delete] /products", () => {
    it("should successfully delete a product", async () => {
      const category = categories[3];
      const product = await createProductHelper(testingModule, category);

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

    it("should don't delete a category after product deleting", async () => {
      const category = categories[3];
      const product = await createProductHelper(testingModule, category);

      await api.deleteProduct(product.uuid);

      const getProductCategoryResponse = await api.getProductCategory(
        category.uuid
      );

      expect(getProductCategoryResponse.status).toEqual(200);
      expect(getProductCategoryResponse.body).toEqual({
        statusCode: 200,
        data: deleteObjectPropsHelper(category, ["updated_at", "created_at"]),
      });
    });

    it("should throw an error when delete a non-exists product", async () => {
      const fakeProductUUID = faker.datatype.uuid();

      const deleteProductResponse = await api.deleteProduct(fakeProductUUID);

      expect(deleteProductResponse.status).toEqual(404);
      expect(deleteProductResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The product ${fakeProductUUID} does not exist`,
      });
    });
  });
});
