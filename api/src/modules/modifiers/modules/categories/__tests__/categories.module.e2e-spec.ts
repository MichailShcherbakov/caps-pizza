import { faker } from "@faker-js/faker";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/delete-object-props.helper";
import { fromJson, toJson } from "~/utils/json.helper";
import { CreateModifierCategoryDto } from "../categories.dto";
import Api from "./helpers/api.helper";
import createModifierCategoriesHelper, {
  createModifierCategoryHelper,
} from "./helpers/create-modifier-categories.helper";
import TestingModule from "./helpers/testing-module.helper";

describe("[Modifier Categories Module] ...", () => {
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

  describe("[Get] /modifiers/categories", () => {
    it("should return all exists modifier categories", async () => {
      const modifierCategories = await createModifierCategoriesHelper(
        testingModule.dataSource
      );

      const getModifierCategoriesResponse = await api.getModifierCategories();

      expect(getModifierCategoriesResponse.status).toEqual(200);
      expect(getModifierCategoriesResponse.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson(
            deleteObjectsPropsHelper(modifierCategories, [
              "updated_at",
              "created_at",
            ])
          )
        ),
      });
    });

    it("should return a special modifier category", async () => {
      const modifierCategories = await createModifierCategoriesHelper(
        testingModule.dataSource
      );
      const modifierCategory = modifierCategories[2];

      const getModifierCategoryResponse = await api.getModifierCategory(
        modifierCategory.uuid
      );

      expect(getModifierCategoryResponse.status).toEqual(200);
      expect(getModifierCategoryResponse.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson(
            deleteObjectPropsHelper(modifierCategory, [
              "updated_at",
              "created_at",
            ])
          )
        ),
      });
    });
  });

  describe("[Post] /modifier/categories", () => {
    it("should successfully create a category", async () => {
      const dto: CreateModifierCategoryDto = {
        name: faker.commerce.productName(),
        image_url: faker.image.imageUrl(),
      };

      const createModifierCategoryResponse = await api.createModifierCategory(
        dto
      );

      expect(createModifierCategoryResponse.statusCode).toEqual(201);
      expect(createModifierCategoryResponse.body.data).toHaveProperty("uuid");
      expect(createModifierCategoryResponse.body.data).toHaveProperty("name");
      expect(createModifierCategoryResponse.body.data).toHaveProperty(
        "image_url"
      );
      expect(createModifierCategoryResponse.body).toEqual({
        statusCode: 201,
        data: {
          ...createModifierCategoryResponse.body.data,
          ...dto,
        },
      });
    });

    it("should throw an error when creating a category without name", async () => {
      const dto: Partial<CreateModifierCategoryDto> = {};

      const createModifierCategoryResponse = await api.createModifierCategory(
        dto as any
      );

      expect(createModifierCategoryResponse.statusCode).toEqual(400);
      expect(createModifierCategoryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: ["name should not be empty", "name must be a string"],
      });
    });
  });

  describe("[Delete] /categories", () => {
    it("should successfully delete a category", async () => {
      const modifierCategory = await createModifierCategoryHelper(
        testingModule.dataSource
      );

      const deleteModifierCategoryResponse = await api.deleteModifierCategory(
        modifierCategory.uuid
      );

      expect(deleteModifierCategoryResponse.statusCode).toEqual(200);
      expect(deleteModifierCategoryResponse.body).toEqual({
        statusCode: 200,
      });

      const getModifierCategoryResponse = await api.getModifierCategory(
        modifierCategory.uuid
      );

      expect(getModifierCategoryResponse.statusCode).toEqual(404);
      expect(getModifierCategoryResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The modifier category ${modifierCategory.uuid} does not exist`,
      });
    });

    it("should throw an error when deleting non-existing category", async () => {
      const fakeModifierCategoryUUID = faker.datatype.uuid();

      const deleteModifierCategoryResponse = await api.deleteModifierCategory(
        fakeModifierCategoryUUID
      );

      expect(deleteModifierCategoryResponse.statusCode).toEqual(404);
      expect(deleteModifierCategoryResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The modifier category ${fakeModifierCategoryUUID} does not exist`,
      });
    });
  });
});
