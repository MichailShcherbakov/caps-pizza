import { faker } from "@faker-js/faker";
import ModifierCategoryEntity from "~/db/entities/modifier-category.entity";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/delete-object-props.helper";
import { fromJson, toJson } from "~/utils/json.helper";
import { CreateModifierDto } from "../modifiers.dto";
import createModifierCategoriesHelper from "../modules/categories/__tests__/helpers/create-modifier-categories.helper";
import Api from "./helpers/api.helper";
import createModifiersHelper from "./helpers/create-modifiers.helper";
import TestingModule from "./helpers/testing-module.helper";

describe("[Modifier Module] ...", () => {
  let testingModule: TestingModule;
  let api: Api;
  let categories: ModifierCategoryEntity[];

  beforeAll(async () => {
    testingModule = new TestingModule();

    await testingModule.init();

    api = new Api(testingModule.app);

    await testingModule.clearDataSource();
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
            deleteObjectsPropsHelper(modifiers, ["updated_at", "created_at"])
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
      };

      const createModifierResponse = await api.createModifier(dto as any);

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
  });
});
