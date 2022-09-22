import { faker } from "@faker-js/faker";
import TestingModule from "./helpers/testing-module.helper";
import createPromotionsHelper, {
  createPromotionHelper,
} from "./helpers/create-promotion.helper";
import Api from "./helpers/api.helper";
import PromotionsService from "../promotions.service";
import { CreatePromotionDto, UpdatePromotionDto } from "../promotions.dto";

describe("[Promotion Module] ...", () => {
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

  describe("[Get] /promotions", () => {
    it("should return all exists promotions", async () => {
      const products = await createPromotionsHelper(testingModule);

      const getPromotionsResponse = await api.getPromotions();

      expect(getPromotionsResponse.status).toEqual(200);
      expect(getPromotionsResponse.body).toEqual({
        statusCode: 200,
        data: PromotionsService.sort(products),
      });
    });

    it("should return a special promotion", async () => {
      const promotion = await createPromotionHelper(testingModule);

      const getPromotionResponse = await api.getPromotion(promotion.uuid);

      expect(getPromotionResponse.status).toEqual(200);
      expect(getPromotionResponse.body).toEqual({
        statusCode: 200,
        data: promotion,
      });
    });

    it("should throw an error when getting a non-existing promotion", async () => {
      const fakePromotionUUID = faker.datatype.uuid();

      const getPromotionResponse = await api.getPromotion(fakePromotionUUID);

      expect(getPromotionResponse.status).toEqual(404);
      expect(getPromotionResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The promotion ${fakePromotionUUID} does not exist`,
      });
    });
  });

  describe("[Post] /promotions", () => {
    it("should successfully create a promotion", async () => {
      const dto: CreatePromotionDto = {
        name: faker.datatype.uuid(),
        image_url: faker.datatype.uuid(),
        display: true,
        display_position: 0,
      };

      const createPromotionResponse = await api.createPromotion(dto);

      expect(createPromotionResponse.status).toEqual(201);
      expect(createPromotionResponse.body).toEqual({
        statusCode: 201,
        data: {
          uuid: createPromotionResponse.body.data.uuid,
          ...dto,
        },
      });
    });

    it("should throw an error when creating promotion with already exists promotion name", async () => {
      const otherProduct = await createPromotionHelper(testingModule);

      const dto: CreatePromotionDto = {
        name: otherProduct.name,
        image_url: faker.datatype.uuid(),
        display: true,
        display_position: 0,
      };

      const createProductResponse = await api.createPromotion(dto);

      expect(createProductResponse.status).toEqual(400);
      expect(createProductResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The promotion with the ${dto.name} name already exists`,
      });
    });

    it("should throw an error when creating promotion with already exists promotion image url", async () => {
      const otherProduct = await createPromotionHelper(testingModule);

      const dto: CreatePromotionDto = {
        name: faker.datatype.uuid(),
        image_url: otherProduct.image_url,
        display: true,
        display_position: 0,
      };

      const createProductResponse = await api.createPromotion(dto);

      expect(createProductResponse.status).toEqual(400);
      expect(createProductResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The promotion with the ${dto.image_url} image already exists`,
      });
    });
  });

  describe("[Put] /promotions", () => {
    it("should successfully update a promotion", async () => {
      const promotion = await createPromotionHelper(testingModule);

      const dto: UpdatePromotionDto = {
        name: faker.datatype.uuid(),
        image_url: faker.datatype.uuid(),
        display: false,
        display_position: faker.datatype.number(),
      };

      const updatePromotionResponse = await api.updatePromotion(
        promotion.uuid,
        dto
      );

      expect(updatePromotionResponse.status).toEqual(200);
      expect(updatePromotionResponse.body).toEqual({
        statusCode: 200,
        data: {
          ...promotion,
          ...dto,
        },
      });
    });

    it("should throw an error when updating promotion with already exists promotion name", async () => {
      const promotion = await createPromotionHelper(testingModule);
      const otherPromotion = await createPromotionHelper(testingModule);

      const dto: UpdatePromotionDto = {
        name: otherPromotion.name,
      };

      const updatePromotionResponse = await api.updatePromotion(
        promotion.uuid,
        dto
      );

      expect(updatePromotionResponse.status).toEqual(400);
      expect(updatePromotionResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The promotion with the ${dto.name} name already exists`,
      });
    });

    it("should throw an error when updating promotion with already exists promotion image url", async () => {
      const promotion = await createPromotionHelper(testingModule);
      const otherPromotion = await createPromotionHelper(testingModule);

      const dto: UpdatePromotionDto = {
        image_url: otherPromotion.image_url,
      };

      const updatePromotionResponse = await api.updatePromotion(
        promotion.uuid,
        dto
      );

      expect(updatePromotionResponse.status).toEqual(400);
      expect(updatePromotionResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The promotion with the ${dto.image_url} image already exists`,
      });
    });
  });

  describe("[Delete] /promotions", () => {
    it("should successfully delete a promotion", async () => {
      const promotion = await createPromotionHelper(testingModule);

      const deletePromotionResponse = await api.deletePromotion(promotion.uuid);

      expect(deletePromotionResponse.status).toEqual(200);
      expect(deletePromotionResponse.body).toEqual({
        statusCode: 200,
      });

      const getPromotionResponse = await api.getPromotion(promotion.uuid);

      expect(getPromotionResponse.status).toEqual(404);
      expect(getPromotionResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The promotion ${promotion.uuid} does not exist`,
      });
    });

    it("should throw an error when delete a non-exists product", async () => {
      const fakePromotionUUID = faker.datatype.uuid();

      const deletePromotionResponse = await api.deletePromotion(
        fakePromotionUUID
      );

      expect(deletePromotionResponse.status).toEqual(404);
      expect(deletePromotionResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The promotion ${fakePromotionUUID} does not exist`,
      });
    });
  });
});
