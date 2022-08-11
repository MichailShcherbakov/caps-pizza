import { faker } from "@faker-js/faker";
import ModifierCategoryEntity from "~/db/entities/modifier-category.entity";
import { createProductCategoryHelper } from "~/modules/products/modules/categories/__tests__/helpers/create-categories.helper";
import { createProductHelper } from "~/modules/products/__tests__/helpers/create-products.helper";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/delete-object-props.helper";
import { fromJson, toJson } from "~/utils/json.helper";
import { CreateModifierDto, UpdateModifierDto } from "../modifiers.dto";
import ModifiersService from "../modifiers.service";
import createModifierCategoriesHelper from "../modules/categories/__tests__/helpers/create-modifier-categories.helper";
import Api from "./helpers/api.helper";
import createModifiersHelper, {
  createModifierHelper,
} from "./helpers/create-modifiers.helper";
import TestingModule from "./helpers/testing-module.helper";

describe("[Modifier Module] ...", () => {
  let testingModule: TestingModule;
  let api: Api;
  let categories: ModifierCategoryEntity[];

  beforeAll(async () => {
    testingModule = new TestingModule();

    await testingModule.init();

    api = new Api(testingModule.app);
  });

  beforeEach(async () => {
    categories = await createModifierCategoriesHelper(testingModule.dataSource);
  });

  afterEach(async () => {
    await testingModule.clearDataSource();
  });

  afterAll(async () => {
    await testingModule.drop();
  });

  describe("[Get] /modifiers", () => {
    it("should return all exists modifiers", async () => {
      const modifiers = await createModifiersHelper(
        testingModule.dataSource,
        categories
      );

      const getModifiersResponse = await api.getModifiers();

      expect(getModifiersResponse.status).toEqual(200);
      expect(getModifiersResponse.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson(
            deleteObjectsPropsHelper(ModifiersService.sort(modifiers), [
              "updated_at",
              "created_at",
            ])
          )
        ),
      });
    });

    it("should return a special modifier", async () => {
      const modifiers = await createModifiersHelper(
        testingModule.dataSource,
        categories
      );
      const modifier = modifiers[4];

      const getModifierResponse = await api.getModifier(modifier.uuid);

      expect(getModifierResponse.status).toEqual(200);
      expect(getModifierResponse.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson(
            deleteObjectPropsHelper(modifier, ["updated_at", "created_at"])
          )
        ),
      });
    });

    it("should throw an error when getting a non-existing modifiers", async () => {
      const fakeModifierUUID = faker.datatype.uuid();

      const getModifierResponse = await api.getModifier(fakeModifierUUID);

      expect(getModifierResponse.status).toEqual(404);
      expect(getModifierResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The modifier ${fakeModifierUUID} does not exist`,
      });
    });
  });

  describe("[Post] /modifiers", () => {
    it("should successfully create a modifier", async () => {
      const category = categories[5];
      const dto: CreateModifierDto = {
        name: faker.word.noun(),
        article_number: faker.datatype.number(),
        price: faker.datatype.number(),
        display_position: faker.datatype.number(),
        category_uuid: category.uuid,
      };

      const createModifierResponse = await api.createModifier(dto);

      expect(createModifierResponse.status).toEqual(201);
      expect(createModifierResponse.body.data).toHaveProperty("uuid");
      expect(createModifierResponse.body.data).toHaveProperty("name");
      expect(createModifierResponse.body.data).toHaveProperty("desc");
      expect(createModifierResponse.body.data).toHaveProperty("image_url");
      expect(createModifierResponse.body.data).toHaveProperty("article_number");
      expect(createModifierResponse.body.data).toHaveProperty("category_uuid");
      expect(createModifierResponse.body).toEqual({
        statusCode: 201,
        data: {
          ...createModifierResponse.body.data,
          ...dto,
        },
      });
    });

    it("should throw an error when creating a modifier without a category", async () => {
      const dto: Partial<CreateModifierDto> = {
        name: faker.word.noun(),
        article_number: faker.datatype.number(),
        image_url: faker.image.imageUrl(),
        price: faker.datatype.number(),
        display_position: faker.datatype.number(),
      };

      const createModifierResponse = await api.createModifier(
        dto as CreateModifierDto
      );

      expect(createModifierResponse.status).toEqual(400);
      expect(createModifierResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: [
          "category_uuid should not be empty",
          "category_uuid must be a string",
          "category_uuid must be a UUID",
        ],
      });
    });

    it("should throw an error when creating a modifier with non-exists a category", async () => {
      const dto: CreateModifierDto = {
        name: faker.word.noun(),
        article_number: faker.datatype.number(),
        image_url: faker.image.imageUrl(),
        price: faker.datatype.number(),
        display_position: faker.datatype.number(),
        category_uuid: faker.datatype.uuid(),
      };

      const createModifierResponse = await api.createModifier(dto);

      expect(createModifierResponse.status).toEqual(404);
      expect(createModifierResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The modifier category ${dto.category_uuid} does not exist`,
      });
    });

    it("should throw an error when creating a modifier with exists name and category", async () => {
      const initialCategory = categories[2];
      const initialModifier = await createModifierHelper(
        testingModule.dataSource,
        initialCategory
      );

      const dto: CreateModifierDto = {
        name: initialModifier.name,
        article_number: faker.datatype.number(),
        image_url: faker.image.imageUrl(),
        price: faker.datatype.number(),
        display_position: faker.datatype.number(),
        category_uuid: initialModifier.category_uuid,
      };

      const createModifierResponse = await api.createModifier(dto);

      expect(createModifierResponse.status).toEqual(400);
      expect(createModifierResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The modifier with ${dto.name} name in ${initialCategory.name} category already exists`,
      });
    });

    it("should throw an error when creating a modifier with exists product article number", async () => {
      const productCategory = await createProductCategoryHelper(
        testingModule.dataSource
      );
      const product = await createProductHelper(
        testingModule.dataSource,
        productCategory
      );
      const modifierCategory = categories[5];

      const dto: CreateModifierDto = {
        name: faker.datatype.string(),
        article_number: product.article_number,
        image_url: faker.image.imageUrl(),
        price: faker.datatype.number(),
        display_position: faker.datatype.number(),
        category_uuid: modifierCategory.uuid,
      };

      const createModifierResponse = await api.createModifier(dto);

      expect(createModifierResponse.status).toEqual(400);
      expect(createModifierResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The product ${product.uuid} already has the article number`,
      });
    });

    it("should throw an error when creating a modifier with exists modifier article number", async () => {
      const otherCategory = categories[1];
      const otherModifier = await createModifierHelper(
        testingModule.dataSource,
        otherCategory
      );
      const category = categories[5];

      const dto: CreateModifierDto = {
        name: faker.datatype.string(),
        article_number: otherModifier.article_number,
        image_url: faker.image.imageUrl(),
        price: faker.datatype.number(),
        display_position: faker.datatype.number(),
        category_uuid: category.uuid,
      };

      const createModifierResponse = await api.createModifier(dto);

      expect(createModifierResponse.status).toEqual(400);
      expect(createModifierResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The modifier ${otherModifier.uuid} already has the article number`,
      });
    });
  });

  describe("[Put] /modifiers", () => {
    it("should successfully updating a modifier", async () => {
      const initialCategory = categories[1];
      const initialModifier = await createModifierHelper(
        testingModule.dataSource,
        initialCategory
      );

      const newCategory = categories[3];
      const dto: UpdateModifierDto = {
        name: faker.datatype.string(),
        article_number: faker.datatype.number(),
        image_url: faker.image.imageUrl(),
        price: faker.datatype.number(),
        display_position: faker.datatype.number(),
        category_uuid: newCategory.uuid,
      };

      const updateModifierResponse = await api.updateModifier(
        initialModifier.uuid,
        dto
      );

      expect(updateModifierResponse.status).toEqual(200);
      expect(updateModifierResponse.body).toEqual({
        statusCode: 200,
        data: {
          ...updateModifierResponse.body.data,
          ...dto,
        },
      });
    });

    it("should throw an error when updating a non-exists modifier category", async () => {
      const initialCategory = categories[1];
      const initialModifier = await createModifierHelper(
        testingModule.dataSource,
        initialCategory
      );

      const dto: UpdateModifierDto = {
        name: faker.datatype.string(),
        article_number: faker.datatype.number(),
        image_url: faker.image.imageUrl(),
        price: faker.datatype.number(),
        display_position: faker.datatype.number(),
        category_uuid: faker.datatype.uuid(),
      };

      const updateModifierResponse = await api.updateModifier(
        initialModifier.uuid,
        dto
      );

      expect(updateModifierResponse.status).toEqual(404);
      expect(updateModifierResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The modifier category ${dto.category_uuid} does not exist`,
      });
    });

    it("should throw an error when updating exists name and category", async () => {
      const initialCategory = categories[1];
      const initialModifier = await createModifierHelper(
        testingModule.dataSource,
        initialCategory
      );

      const otherCategory = categories[3];
      const otherModifier = await createModifierHelper(
        testingModule.dataSource,
        otherCategory
      );

      const dto: UpdateModifierDto = {
        name: otherModifier.name,
        article_number: faker.datatype.number(),
        image_url: faker.image.imageUrl(),
        price: faker.datatype.number(),
        display_position: faker.datatype.number(),
        category_uuid: otherModifier.category_uuid,
      };

      const updateModifierResponse = await api.updateModifier(
        initialModifier.uuid,
        dto
      );

      expect(updateModifierResponse.status).toEqual(400);
      expect(updateModifierResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The modifier with ${otherModifier.name} name in ${otherCategory.name} category already exists`,
      });
    });

    it("should throw an error when updating a non-exists modifier", async () => {
      const fakeModifierUUID = faker.datatype.uuid();

      const dto: UpdateModifierDto = {
        name: faker.datatype.string(),
        article_number: faker.datatype.number(),
        image_url: faker.image.imageUrl(),
        price: faker.datatype.number(),
        display_position: faker.datatype.number(),
      };

      const updateModifierResponse = await api.updateModifier(
        fakeModifierUUID,
        dto
      );

      expect(updateModifierResponse.status).toEqual(404);
      expect(updateModifierResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The modifier ${fakeModifierUUID} does not exist`,
      });
    });

    it("should throw an error when updating a modifier with exists product article number", async () => {
      const productCategory = await createProductCategoryHelper(
        testingModule.dataSource
      );
      const product = await createProductHelper(
        testingModule.dataSource,
        productCategory
      );
      const initialCategory = categories[1];
      const initialModifier = await createModifierHelper(
        testingModule.dataSource,
        initialCategory
      );

      const dto: UpdateModifierDto = {
        article_number: product.article_number,
      };

      const createModifierResponse = await api.updateModifier(
        initialModifier.uuid,
        dto
      );

      expect(createModifierResponse.status).toEqual(400);
      expect(createModifierResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The product ${product.uuid} already has the article number`,
      });
    });

    it("should throw an error when updating a modifier with exists modifier article number", async () => {
      const otherCategory = categories[1];
      const otherModifier = await createModifierHelper(
        testingModule.dataSource,
        otherCategory
      );
      const initialCategory = categories[1];
      const initialModifier = await createModifierHelper(
        testingModule.dataSource,
        initialCategory
      );

      const dto: UpdateModifierDto = {
        article_number: otherModifier.article_number,
      };

      const createModifierResponse = await api.updateModifier(
        initialModifier.uuid,
        dto
      );

      expect(createModifierResponse.status).toEqual(400);
      expect(createModifierResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The modifier ${otherModifier.uuid} already has the article number`,
      });
    });
  });

  describe("[Delete] /modifiers/categories", () => {
    it("should successfully delete a category that already has a modifiers", async () => {
      const modifiers = await createModifiersHelper(
        testingModule.dataSource,
        categories
      );
      const modifier = modifiers[3];
      const category = categories[3];

      expect(modifier.category_uuid).toEqual(category.uuid);

      const deleteCategoryResponse = await api.deleteModifierCategory(
        category.uuid
      );

      expect(deleteCategoryResponse.status).toEqual(200);
      expect(deleteCategoryResponse.body).toEqual({
        statusCode: 200,
      });

      const getModifierResponse = await api.getModifier(modifier.uuid);

      expect(getModifierResponse.status).toEqual(404);
      expect(getModifierResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The modifier ${modifier.uuid} does not exist`,
      });
    });
  });

  describe("[Delete] /modifiers", () => {
    it("should successfully delete a modifier", async () => {
      const modifiers = await createModifiersHelper(
        testingModule.dataSource,
        categories
      );
      const modifier = modifiers[3];

      const deleteModifierResponse = await api.deleteModifier(modifier.uuid);

      expect(deleteModifierResponse.status).toEqual(200);
      expect(deleteModifierResponse.body).toEqual({
        statusCode: 200,
      });

      const getModifierResponse = await api.getModifier(modifier.uuid);

      expect(getModifierResponse.status).toEqual(404);
      expect(getModifierResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The modifier ${modifier.uuid} does not exist`,
      });
    });

    it("should throw an error when delete a non-exists modifier", async () => {
      const fakeModifierUUID = faker.datatype.uuid();

      const deleteModifierResponse = await api.deleteModifier(fakeModifierUUID);

      expect(deleteModifierResponse.status).toEqual(404);
      expect(deleteModifierResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The modifier ${fakeModifierUUID} does not exist`,
      });
    });
  });
});
