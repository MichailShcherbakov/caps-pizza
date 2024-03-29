import { faker } from "@faker-js/faker";
import {
  ModifierCategoryChoiceOptionEnum,
  ModifierCategoryDisplayVariantEnum,
} from "@monorepo/common";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/__tests__/helpers/delete-object-props.helper";
import { fromJson, toJson } from "~/utils/__tests__/helpers/json.helper";
import {
  CreateModifierCategoryDto,
  UpdateModifierCategoryDto,
} from "../categories.dto";
import ModifierCategoriesService from "../categories.service";
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

    await api.init();
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
        testingModule
      );

      const getModifierCategoriesResponse = await api.getModifierCategories();

      expect(getModifierCategoriesResponse.status).toEqual(200);
      expect(getModifierCategoriesResponse.body).toEqual({
        statusCode: 200,
        data: fromJson(
          toJson(
            deleteObjectsPropsHelper(
              ModifierCategoriesService.sort(modifierCategories),
              ["updated_at", "created_at"]
            )
          )
        ),
      });
    });

    it("should return a special modifier category", async () => {
      const modifierCategories = await createModifierCategoriesHelper(
        testingModule
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
        name: faker.datatype.uuid(),
        image_url: faker.datatype.uuid(),
        choice_option: ModifierCategoryChoiceOptionEnum.ONE,
        display: true,
        display_name: faker.datatype.uuid(),
        display_variant: ModifierCategoryDisplayVariantEnum.SWITCHER,
        display_position: 1,
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

    it("should throw an error when creating a category without data", async () => {
      const dto: Partial<CreateModifierCategoryDto> = {};

      const createModifierCategoryResponse = await api.createModifierCategory(
        dto as CreateModifierCategoryDto
      );

      expect(createModifierCategoryResponse.statusCode).toEqual(400);
      expect(createModifierCategoryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: [
          "name should not be empty",
          "name must be a string",
          "choice_option should not be empty",
          "choice_option must be a valid enum value",
          "display should not be empty",
          "display must be a boolean value",
          "display_variant should not be empty",
          "display_variant must be a valid enum value",
        ],
      });
    });

    it("should throw an error when creating a category with existing name", async () => {
      const dto: CreateModifierCategoryDto = {
        name: faker.datatype.uuid(),
        choice_option: ModifierCategoryChoiceOptionEnum.ONE,
        display: true,
        display_name: faker.datatype.uuid(),
        display_variant: ModifierCategoryDisplayVariantEnum.SWITCHER,
        display_position: 1,
      };

      const firstCreateModifierCategoryResponse =
        await api.createModifierCategory(dto);

      expect(firstCreateModifierCategoryResponse.statusCode).toEqual(201);

      const secondCreateModifierCategoryResponse =
        await api.createModifierCategory({
          name: dto.name,
          choice_option: ModifierCategoryChoiceOptionEnum.ONE,
          display: true,
          display_name: faker.datatype.uuid(),
          display_variant: ModifierCategoryDisplayVariantEnum.SWITCHER,
          display_position: 1,
        });

      expect(secondCreateModifierCategoryResponse.statusCode).toEqual(400);
      expect(secondCreateModifierCategoryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The modifier category with '${dto.name}' name already exists`,
      });
    });

    it("should throw an error when creating a category with existing display name", async () => {
      const dto: CreateModifierCategoryDto = {
        name: faker.datatype.uuid(),
        choice_option: ModifierCategoryChoiceOptionEnum.ONE,
        display: true,
        display_name: faker.datatype.uuid(),
        display_variant: ModifierCategoryDisplayVariantEnum.SWITCHER,
        display_position: 1,
      };

      const firstCreateModifierCategoryResponse =
        await api.createModifierCategory(dto);

      expect(firstCreateModifierCategoryResponse.statusCode).toEqual(201);

      const secondCreateModifierCategoryResponse =
        await api.createModifierCategory({
          name: faker.datatype.uuid(),
          choice_option: ModifierCategoryChoiceOptionEnum.ONE,
          display: true,
          display_name: dto.display_name,
          display_variant: ModifierCategoryDisplayVariantEnum.SWITCHER,
          display_position: 1,
        });

      expect(secondCreateModifierCategoryResponse.statusCode).toEqual(400);
      expect(secondCreateModifierCategoryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The modifier category with '${dto.display_name}' display name already exists`,
      });
    });
  });

  describe("[Put] /modifiers/categories", () => {
    it("should successfully update a category", async () => {
      const initialCarogory = await createModifierCategoryHelper(testingModule);

      const dto: UpdateModifierCategoryDto = {
        name: faker.datatype.uuid(),
        choice_option: ModifierCategoryChoiceOptionEnum.ONE,
        display: true,
        display_name: faker.datatype.uuid(),
        display_variant: ModifierCategoryDisplayVariantEnum.SWITCHER,
        display_position: faker.datatype.number(),
      };

      const updateModifierCategoryResponse = await api.updateModifierCategory(
        initialCarogory.uuid,
        dto
      );

      expect(updateModifierCategoryResponse.status).toEqual(200);
      expect(updateModifierCategoryResponse.body).toEqual({
        statusCode: 200,
        data: {
          ...updateModifierCategoryResponse.body.data,
          ...dto,
        },
      });
    });

    it("should throw an error when update a non-exists category", async () => {
      const dto: UpdateModifierCategoryDto = {
        name: faker.datatype.uuid(),
        display_position: faker.datatype.number(),
      };

      const fakerModifierCategoryUUID = faker.datatype.uuid();

      const updateModifierCategoryResponse = await api.updateModifierCategory(
        fakerModifierCategoryUUID,
        dto
      );

      expect(updateModifierCategoryResponse.status).toEqual(404);
      expect(updateModifierCategoryResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The modifier category ${fakerModifierCategoryUUID} does not exist`,
      });
    });

    it("should throw an error when update a with exists name", async () => {
      const otherCategory = await createModifierCategoryHelper(testingModule);
      const category = await createModifierCategoryHelper(testingModule);

      const dto: UpdateModifierCategoryDto = {
        name: otherCategory.name,
      };

      const updateModifierCategoryResponse = await api.updateModifierCategory(
        category.uuid,
        dto
      );

      expect(updateModifierCategoryResponse.status).toEqual(400);
      expect(updateModifierCategoryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The modifier category with '${dto.name}' name already exists`,
      });
    });

    it("should throw an error when update a with exists display name", async () => {
      const otherCategory = await createModifierCategoryHelper(testingModule, {
        display_name: faker.datatype.uuid(),
      });
      const category = await createModifierCategoryHelper(testingModule);

      const dto: UpdateModifierCategoryDto = {
        display_name: otherCategory.display_name,
      };

      const updateModifierCategoryResponse = await api.updateModifierCategory(
        category.uuid,
        dto
      );

      expect(updateModifierCategoryResponse.status).toEqual(400);
      expect(updateModifierCategoryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The modifier category with '${dto.display_name}' display name already exists`,
      });
    });
  });

  describe("[Delete] /modifiers/categories", () => {
    it("should successfully delete a category", async () => {
      const modifierCategory = await createModifierCategoryHelper(
        testingModule
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
