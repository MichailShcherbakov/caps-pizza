import { faker } from "@faker-js/faker";
import {
  DeliveryCriteriaEnum,
  DeliveryOperatorEnum,
  DeliveryTypeEnum,
} from "~/db/entities/delivery.entity";
import { createModifierCategoryHelper } from "~/modules/modifiers/modules/categories/__tests__/helpers/create-modifier-categories.helper";
import { createModifierHelper } from "~/modules/modifiers/__tests__/helpers/create-modifiers.helper";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/__tests__/helpers/delete-object-props.helper";
import { CreateDeliveryDto, UpdateDeliveryDto } from "../deliveries.dto";
import DeliveriesService from "../deliveries.service";
import Api from "./helpers/api.helper";
import {
  createDeliveriesHelper,
  createDeliveryHelper,
} from "./helpers/create-deliveries.helper";
import TestingModule from "./helpers/testing-module.helper";

describe("[Delivery Module] ...", () => {
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

  describe("[Get] /deliveries", () => {
    it("should return all exists deliveries", async () => {
      const deliveries = await createDeliveriesHelper(testingModule);

      const getDeliveriesResponse = await api.getDeliveries();

      expect(getDeliveriesResponse.status).toEqual(200);
      expect(getDeliveriesResponse.body).toEqual({
        statusCode: 200,
        data: deleteObjectsPropsHelper(DeliveriesService.sort(deliveries), [
          "updated_at",
          "created_at",
        ]),
      });
    });

    it("should return a special delivery", async () => {
      const delivery = await createDeliveryHelper(testingModule);

      const getDeliveryResponse = await api.getDelivery(delivery.uuid);

      expect(getDeliveryResponse.status).toEqual(200);
      expect(getDeliveryResponse.body).toEqual({
        statusCode: 200,
        data: deleteObjectPropsHelper(delivery, ["updated_at", "created_at"]),
      });
    });

    it("should throw an erron when a delivery does not exists", async () => {
      const fakeDeliveryUUID = faker.datatype.uuid();

      const getDeliveryResponse = await api.getDelivery(fakeDeliveryUUID);

      expect(getDeliveryResponse.status).toEqual(404);
      expect(getDeliveryResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The delivery ${fakeDeliveryUUID} does not exist`,
      });
    });
  });

  describe("[Post] /deliveries", () => {
    it("should successfully create a delivery", async () => {
      const dto: CreateDeliveryDto = {
        name: faker.datatype.string(),
        article_number: faker.datatype.number(),
        condition: {
          criteria: DeliveryCriteriaEnum.PRICE,
          op: DeliveryOperatorEnum.GREATER,
          value: 2000,
        },
        type: DeliveryTypeEnum.IN_CASH,
        value: 100,
      };

      const createDeliveryResponse = await api.createDelivery(dto);

      expect(createDeliveryResponse.status).toEqual(201);
      expect(createDeliveryResponse.body).toEqual({
        statusCode: 201,
        data: {
          uuid: createDeliveryResponse.body.data.uuid,
          ...dto,
        },
      });
    });

    it("should throw an error when creating a delivery with existing name", async () => {
      const existsDelivery = await createDeliveryHelper(testingModule);

      const dto: CreateDeliveryDto = {
        name: existsDelivery.name,
        article_number: faker.datatype.number(),
        condition: {
          criteria: DeliveryCriteriaEnum.PRICE,
          op: DeliveryOperatorEnum.GREATER,
          value: 2000,
        },
        type: DeliveryTypeEnum.IN_CASH,
        value: 100,
      };

      const createDeliveryResponse = await api.createDelivery(dto);

      expect(createDeliveryResponse.status).toEqual(400);
      expect(createDeliveryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The delivery with '${dto.name}' name already exists`,
      });
    });

    it(`should throw an error when creating a delivery with ${DeliveryTypeEnum.PERCENT} delivery type and with a value that greater than 100`, async () => {
      const dto: CreateDeliveryDto = {
        name: faker.datatype.string(),
        article_number: faker.datatype.number(),
        condition: {
          criteria: DeliveryCriteriaEnum.PRICE,
          op: DeliveryOperatorEnum.GREATER,
          value: 2000,
        },
        type: DeliveryTypeEnum.PERCENT,
        value: 200,
      };

      const createDeliveryResponse = await api.createDelivery(dto);

      expect(createDeliveryResponse.status).toEqual(400);
      expect(createDeliveryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The delivery cannot has the value greater then 100 when it has ${DeliveryTypeEnum.PERCENT} type`,
      });
    });

    it(`should throw an error when creating a delivery with ${DeliveryOperatorEnum.BETWEEN} delivery operator and without without providing the value2`, async () => {
      const dto: CreateDeliveryDto = {
        name: faker.datatype.string(),
        article_number: faker.datatype.number(),
        condition: {
          criteria: DeliveryCriteriaEnum.COUNT,
          op: DeliveryOperatorEnum.BETWEEN,
          value: 5,
        },
        type: DeliveryTypeEnum.IN_CASH,
        value: 200,
      };

      const createDeliveryResponse = await api.createDelivery(dto);

      expect(createDeliveryResponse.status).toEqual(400);
      expect(createDeliveryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The delivery has the ${DeliveryOperatorEnum.BETWEEN} condition operator, but the value2 was not provided`,
      });
    });

    it(`should throw an error when creating a delivery with existing article number`, async () => {
      const modifierCategory = await createModifierCategoryHelper(
        testingModule
      );
      const modifier = await createModifierHelper(
        testingModule,
        modifierCategory
      );

      const dto: CreateDeliveryDto = {
        name: faker.datatype.string(),
        article_number: modifier.article_number,
        condition: {
          criteria: DeliveryCriteriaEnum.COUNT,
          op: DeliveryOperatorEnum.GREATER,
          value: 5,
        },
        type: DeliveryTypeEnum.IN_CASH,
        value: 200,
      };

      const createDeliveryResponse = await api.createDelivery(dto);

      expect(createDeliveryResponse.status).toEqual(400);
      expect(createDeliveryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The modifier ${modifier.uuid} already has the article number`,
      });
    });
  });

  describe("[Put] /deliveries", () => {
    it("should successfully update a delivery", async () => {
      const delivery = await createDeliveryHelper(testingModule);

      const dto: UpdateDeliveryDto = {
        name: faker.datatype.string(),
        article_number: faker.datatype.number(),
        condition: {
          criteria: DeliveryCriteriaEnum.PRICE,
          op: DeliveryOperatorEnum.GREATER,
          value: 2000,
        },
        type: DeliveryTypeEnum.IN_CASH,
        value: 100,
      };

      const updateDeliveryResponse = await api.updateDelivery(
        delivery.uuid,
        dto
      );

      expect(updateDeliveryResponse.status).toEqual(200);
      expect(updateDeliveryResponse.body).toEqual({
        statusCode: 200,
        data: {
          ...deleteObjectPropsHelper(delivery, ["updated_at", "created_at"]),
          ...dto,
        },
      });
    });

    it(`should successfully update a delivery with unique props`, async () => {
      const delivery = await createDeliveryHelper(testingModule);

      const dto: UpdateDeliveryDto = {
        name: delivery.name,
        article_number: delivery.article_number,
        condition: {
          criteria: DeliveryCriteriaEnum.COUNT,
          op: DeliveryOperatorEnum.GREATER,
          value: 5,
        },
        type: DeliveryTypeEnum.IN_CASH,
        value: 200,
      };

      const updateDeliveryResponse = await api.updateDelivery(
        delivery.uuid,
        dto
      );

      expect(updateDeliveryResponse.status).toEqual(200);
      expect(updateDeliveryResponse.body).toEqual({
        statusCode: 200,
        data: {
          ...deleteObjectPropsHelper(delivery, ["updated_at", "created_at"]),
          ...dto,
        },
      });
    });

    it("should throw an error when updating a delivery that does not exist", async () => {
      const fakeDeliveryUUID = faker.datatype.uuid();

      const dto: UpdateDeliveryDto = {
        name: faker.datatype.string(),
        article_number: faker.datatype.number(),
        condition: {
          criteria: DeliveryCriteriaEnum.PRICE,
          op: DeliveryOperatorEnum.GREATER,
          value: 2000,
        },
        type: DeliveryTypeEnum.IN_CASH,
        value: 100,
      };

      const updateDeliveryResponse = await api.updateDelivery(
        fakeDeliveryUUID,
        dto
      );

      expect(updateDeliveryResponse.status).toEqual(404);
      expect(updateDeliveryResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The delivery ${fakeDeliveryUUID} does not exist`,
      });
    });

    it("should throw an error when updating a delivery with existing name", async () => {
      const existsDelivery = await createDeliveryHelper(testingModule);
      const delivery = await createDeliveryHelper(testingModule);

      const dto: UpdateDeliveryDto = {
        name: existsDelivery.name,
        article_number: faker.datatype.number(),
        condition: {
          criteria: DeliveryCriteriaEnum.PRICE,
          op: DeliveryOperatorEnum.GREATER,
          value: 2000,
        },
        type: DeliveryTypeEnum.IN_CASH,
        value: 100,
      };

      const updateDeliveryResponse = await api.updateDelivery(
        delivery.uuid,
        dto
      );

      expect(updateDeliveryResponse.status).toEqual(400);
      expect(updateDeliveryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The delivery with '${dto.name}' name already exists`,
      });
    });

    describe(`should throw an error when creating a delivery with ${DeliveryTypeEnum.PERCENT} delivery type and with a value that greater than 100`, () => {
      test("full update", async () => {
        const delivery = await createDeliveryHelper(testingModule, {
          type: DeliveryTypeEnum.IN_CASH,
          value: 500,
        });

        const dto: UpdateDeliveryDto = {
          type: DeliveryTypeEnum.PERCENT,
          value: 200,
        };

        const updateDeliveryResponse = await api.updateDelivery(
          delivery.uuid,
          dto
        );

        expect(updateDeliveryResponse.status).toEqual(400);
        expect(updateDeliveryResponse.body).toEqual({
          statusCode: 400,
          error: "Bad Request",
          message: `The delivery cannot has the value greater then 100 when it has ${DeliveryTypeEnum.PERCENT} type`,
        });
      });

      test("the value update", async () => {
        const delivery = await createDeliveryHelper(testingModule, {
          type: DeliveryTypeEnum.PERCENT,
          value: 5,
        });

        const dto: UpdateDeliveryDto = {
          value: 200,
        };

        const updateDeliveryResponse = await api.updateDelivery(
          delivery.uuid,
          dto
        );

        expect(updateDeliveryResponse.status).toEqual(400);
        expect(updateDeliveryResponse.body).toEqual({
          statusCode: 400,
          error: "Bad Request",
          message: `The delivery cannot has the value greater then 100 when it has ${DeliveryTypeEnum.PERCENT} type`,
        });
      });

      test("the type update", async () => {
        const delivery = await createDeliveryHelper(testingModule, {
          type: DeliveryTypeEnum.IN_CASH,
          value: 500,
        });

        const dto: UpdateDeliveryDto = {
          type: DeliveryTypeEnum.PERCENT,
        };

        const updateDeliveryResponse = await api.updateDelivery(
          delivery.uuid,
          dto
        );

        expect(updateDeliveryResponse.status).toEqual(400);
        expect(updateDeliveryResponse.body).toEqual({
          statusCode: 400,
          error: "Bad Request",
          message: `The delivery cannot has the value greater then 100 when it has ${DeliveryTypeEnum.PERCENT} type`,
        });
      });
    });

    it(`should throw an error when creating a delivery with ${DeliveryOperatorEnum.BETWEEN} delivery operator and without without providing the value2`, async () => {
      const delivery = await createDeliveryHelper(testingModule);

      const dto: UpdateDeliveryDto = {
        name: faker.datatype.string(),
        article_number: faker.datatype.number(),
        condition: {
          criteria: DeliveryCriteriaEnum.COUNT,
          op: DeliveryOperatorEnum.BETWEEN,
          value: 5,
        },
        type: DeliveryTypeEnum.IN_CASH,
        value: 200,
      };

      const updateDeliveryResponse = await api.updateDelivery(
        delivery.uuid,
        dto
      );

      expect(updateDeliveryResponse.status).toEqual(400);
      expect(updateDeliveryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The delivery has the ${DeliveryOperatorEnum.BETWEEN} condition operator, but the value2 was not provided`,
      });
    });

    it(`should throw an error when creating a delivery with existing article number`, async () => {
      const modifierCategory = await createModifierCategoryHelper(
        testingModule
      );
      const modifier = await createModifierHelper(
        testingModule,
        modifierCategory
      );

      const delivery = await createDeliveryHelper(testingModule);

      const dto: UpdateDeliveryDto = {
        name: faker.datatype.string(),
        article_number: modifier.article_number,
        condition: {
          criteria: DeliveryCriteriaEnum.COUNT,
          op: DeliveryOperatorEnum.GREATER,
          value: 5,
        },
        type: DeliveryTypeEnum.IN_CASH,
        value: 200,
      };

      const updateDeliveryResponse = await api.updateDelivery(
        delivery.uuid,
        dto
      );

      expect(updateDeliveryResponse.status).toEqual(400);
      expect(updateDeliveryResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The modifier ${modifier.uuid} already has the article number`,
      });
    });
  });

  describe("[Delete] /deliveries", () => {
    it("should successfully delete a delivery", async () => {
      const delivery = await createDeliveryHelper(testingModule);

      const deleteDeliveryResponse = await api.deleteDelivery(delivery.uuid);

      expect(deleteDeliveryResponse.status).toEqual(200);
      expect(deleteDeliveryResponse.body).toEqual({
        statusCode: 200,
      });
    });

    it("should throw an error when deleting a delivery that does not exists", async () => {
      const fakeDeliveryUUID = faker.datatype.uuid();

      const deleteDeliveryResponse = await api.deleteDelivery(fakeDeliveryUUID);

      expect(deleteDeliveryResponse.status).toEqual(404);
      expect(deleteDeliveryResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The delivery ${fakeDeliveryUUID} does not exist`,
      });
    });
  });
});
