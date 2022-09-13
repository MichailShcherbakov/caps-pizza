import { faker } from "@faker-js/faker";
import { BadRequestException } from "@nestjs/common";
import DeliveriesService from "~/modules/delivery/deliveries.service";
import ModifiersService from "~/modules/modifiers/modifiers.service";
import ProductsService from "~/modules/products/products.service";
import SyncService from "../sync.service";
import UnitTestingModule from "./helpers/testing-module.helper";

describe("[Unit] [Sync Module] ... ", () => {
  let testingModule: UnitTestingModule;
  let syncService: SyncService;
  let syncWithFrontPadWrapper: jest.SpyInstance;
  let findOneProductWrapper: jest.SpyInstance;
  let findOneModifierWrapper: jest.SpyInstance;
  let findOneDeliveryWrapper: jest.SpyInstance;

  beforeAll(async () => {
    testingModule = new UnitTestingModule();
    await testingModule.init();

    syncService = testingModule.get<SyncService>(SyncService);
    syncService.syncWithFrontPad = jest.fn();
    syncWithFrontPadWrapper = jest.spyOn(syncService, "syncWithFrontPad");

    const productsService = testingModule.get<ProductsService>(ProductsService);
    findOneProductWrapper = jest.spyOn(productsService, "findOne");

    const modifiersService =
      testingModule.get<ModifiersService>(ModifiersService);
    findOneModifierWrapper = jest.spyOn(modifiersService, "findOne");

    const deliveriesService =
      testingModule.get<DeliveriesService>(DeliveriesService);
    findOneDeliveryWrapper = jest.spyOn(deliveriesService, "findOne");

    __DEV__ = false;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe("The not throw error mode", () => {
    it("should return true when article number is available", async () => {
      const TEST_ARTICLE_NUMBER = faker.datatype.number();

      findOneProductWrapper.mockResolvedValueOnce(null);
      findOneModifierWrapper.mockResolvedValueOnce(null);
      findOneDeliveryWrapper.mockResolvedValueOnce(null);
      syncWithFrontPadWrapper.mockResolvedValueOnce(true);

      expect(
        await syncService.isArticleNumberAvailable(TEST_ARTICLE_NUMBER)
      ).toBeTruthy();
    });

    it("should return false when the article number is busy by the product", async () => {
      const TEST_ARTICLE_NUMBER = faker.datatype.number();

      findOneProductWrapper.mockResolvedValueOnce({});

      expect(
        await syncService.isArticleNumberAvailable(TEST_ARTICLE_NUMBER)
      ).toBeFalsy();
    });

    it("should return false when the article number is busy by the modifier", async () => {
      const TEST_ARTICLE_NUMBER = faker.datatype.number();

      findOneModifierWrapper.mockResolvedValueOnce({});

      expect(
        await syncService.isArticleNumberAvailable(TEST_ARTICLE_NUMBER)
      ).toBeFalsy();
    });

    it("should return false when the article number is busy by the delivery", async () => {
      const TEST_ARTICLE_NUMBER = faker.datatype.number();

      findOneDeliveryWrapper.mockResolvedValueOnce({});

      expect(
        await syncService.isArticleNumberAvailable(TEST_ARTICLE_NUMBER)
      ).toBeFalsy();
    });

    it("should return false when the article number is not found in the frontpad platform", async () => {
      const TEST_ARTICLE_NUMBER = faker.datatype.number();

      syncWithFrontPadWrapper.mockResolvedValueOnce(false);

      expect(
        await syncService.isArticleNumberAvailable(TEST_ARTICLE_NUMBER)
      ).toBeFalsy();
    });
  });

  describe("The throw error mode", () => {
    it("should throw an error when the article number is busy by the product", async () => {
      const TEST_ARTICLE_NUMBER = faker.datatype.number();
      const TEST_PRODUCT = { uuid: faker.datatype.uuid() };

      findOneProductWrapper.mockResolvedValueOnce(TEST_PRODUCT);

      await expect(
        syncService.isArticleNumberAvailable(TEST_ARTICLE_NUMBER, true)
      ).rejects.toThrow(
        new BadRequestException(
          `The product ${TEST_PRODUCT.uuid} already has the article number`
        )
      );

      findOneProductWrapper.mockResolvedValueOnce(TEST_PRODUCT);

      expect(
        await syncService.isArticleNumberAvailable(TEST_ARTICLE_NUMBER)
      ).toBeFalsy();
    });

    it("should throw an error when the article number is busy by the modifier", async () => {
      const TEST_ARTICLE_NUMBER = faker.datatype.number();
      const TEST_MODIFIER = { uuid: faker.datatype.uuid() };

      findOneModifierWrapper.mockResolvedValueOnce(TEST_MODIFIER);

      await expect(
        syncService.isArticleNumberAvailable(TEST_ARTICLE_NUMBER, true)
      ).rejects.toThrow(
        new BadRequestException(
          `The modifier ${TEST_MODIFIER.uuid} already has the article number`
        )
      );

      findOneModifierWrapper.mockResolvedValueOnce(TEST_MODIFIER);

      expect(
        await syncService.isArticleNumberAvailable(TEST_ARTICLE_NUMBER)
      ).toBeFalsy();
    });

    it("should throw an error when the article number is busy by the delivery", async () => {
      const TEST_ARTICLE_NUMBER = faker.datatype.number();
      const TEST_DELIVERY = { uuid: faker.datatype.uuid() };

      findOneDeliveryWrapper.mockResolvedValueOnce(TEST_DELIVERY);

      await expect(
        syncService.isArticleNumberAvailable(TEST_ARTICLE_NUMBER, true)
      ).rejects.toThrow(
        new BadRequestException(
          `The delivery ${TEST_DELIVERY.uuid} already has the article number`
        )
      );

      findOneDeliveryWrapper.mockResolvedValueOnce(TEST_DELIVERY);

      expect(
        await syncService.isArticleNumberAvailable(TEST_ARTICLE_NUMBER)
      ).toBeFalsy();
    });

    it("should throw an error when the article number is not found in the frontpad platform", async () => {
      const TEST_ARTICLE_NUMBER = faker.datatype.number();

      syncWithFrontPadWrapper.mockResolvedValueOnce(false);

      await expect(
        syncService.isArticleNumberAvailable(TEST_ARTICLE_NUMBER, true)
      ).rejects.toThrow(
        new BadRequestException(`Sync error. The article number not found`)
      );

      syncWithFrontPadWrapper.mockResolvedValueOnce(false);

      expect(
        await syncService.isArticleNumberAvailable(TEST_ARTICLE_NUMBER)
      ).toBeFalsy();
    });
  });
});
