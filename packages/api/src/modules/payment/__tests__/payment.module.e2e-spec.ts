import { faker } from "@faker-js/faker";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/__tests__/helpers/delete-object-props.helper";
import { CreatePaymentDto, UpdatePaymentDto } from "../orders.dto";
import PaymentService from "../payment.service";
import Api from "./helpers/api.helper";
import {
  createPaymentHelper,
  createPaymentsHelper,
} from "./helpers/create-payments.helper";
import TestingModule from "./helpers/testing-module.helper";

describe("[Payment Module] ...", () => {
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

  describe("[Get] /payments", () => {
    it("should return all exists payments", async () => {
      const payments = await createPaymentsHelper(testingModule);

      const getPaymentsResponse = await api.getPayments();

      expect(getPaymentsResponse.status).toEqual(200);
      expect(getPaymentsResponse.body).toEqual({
        statusCode: 200,
        data: deleteObjectsPropsHelper(PaymentService.sort(payments), [
          "updated_at",
          "created_at",
        ]),
      });
    });

    it("should return a special payment", async () => {
      const payment = await createPaymentHelper(testingModule);

      const getPaymentResponse = await api.getPayment(payment.uuid);

      expect(getPaymentResponse.status).toEqual(200);
      expect(getPaymentResponse.body).toEqual({
        statusCode: 200,
        data: deleteObjectPropsHelper(payment, ["updated_at", "created_at"]),
      });
    });

    it("should throw an erron when a payment does not exists", async () => {
      const fakePaymentUUID = faker.datatype.uuid();

      const getPaymentResponse = await api.getPayment(fakePaymentUUID);

      expect(getPaymentResponse.status).toEqual(404);
      expect(getPaymentResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The payment ${fakePaymentUUID} does not exist`,
      });
    });
  });

  describe("[Post] /payments", () => {
    it("should successfully create a payment", async () => {
      const dto: CreatePaymentDto = {
        name: faker.datatype.uuid(),
        code: faker.datatype.number(),
      };

      const createPaymentResponse = await api.createPayment(dto);

      expect(createPaymentResponse.status).toEqual(201);
      expect(createPaymentResponse.body).toEqual({
        statusCode: 201,
        data: {
          uuid: createPaymentResponse.body.data.uuid,
          ...dto,
        },
      });
    });

    it("should throw an error when creating a payment with existing name", async () => {
      const existsPayment = await createPaymentHelper(testingModule);

      const dto: CreatePaymentDto = {
        name: existsPayment.name,
        code: faker.datatype.number(),
      };

      const createPaymentResponse = await api.createPayment(dto);

      expect(createPaymentResponse.status).toEqual(400);
      expect(createPaymentResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The payment with the ${dto.name} name already exists`,
      });
    });

    it("should throw an error when creating a payment with existing code", async () => {
      const existsPayment = await createPaymentHelper(testingModule);

      const dto: CreatePaymentDto = {
        name: faker.datatype.uuid(),
        code: existsPayment.code,
      };

      const createPaymentResponse = await api.createPayment(dto);

      expect(createPaymentResponse.status).toEqual(400);
      expect(createPaymentResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The payment with the ${dto.code} code already exists`,
      });
    });
  });

  describe("[Put] /payments", () => {
    it("should successfully update a payment", async () => {
      const payment = await createPaymentHelper(testingModule);

      const dto: UpdatePaymentDto = {
        name: faker.datatype.uuid(),
        code: faker.datatype.number(),
      };

      const updatePaymentResponse = await api.updatePayment(payment.uuid, dto);

      expect(updatePaymentResponse.status).toEqual(200);
      expect(updatePaymentResponse.body).toEqual({
        statusCode: 200,
        data: {
          ...deleteObjectPropsHelper(payment, ["updated_at", "created_at"]),
          ...dto,
        },
      });
    });

    it("should throw an error when updating a non-existing payment", async () => {
      const fakePaymentUUID = faker.datatype.uuid();

      const dto: UpdatePaymentDto = {
        name: faker.datatype.uuid(),
        code: faker.datatype.number(),
      };

      const updatePaymentResponse = await api.updatePayment(
        fakePaymentUUID,
        dto
      );

      expect(updatePaymentResponse.status).toEqual(404);
      expect(updatePaymentResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The payment ${fakePaymentUUID} does not exist`,
      });
    });

    it("should throw an error when updating a payment with existing name", async () => {
      const existsPayment = await createPaymentHelper(testingModule);
      const payment = await createPaymentHelper(testingModule);

      const dto: UpdatePaymentDto = {
        name: existsPayment.name,
      };

      const updatePaymentResponse = await api.updatePayment(payment.uuid, dto);

      expect(updatePaymentResponse.status).toEqual(400);
      expect(updatePaymentResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The payment with the ${dto.name} name already exists`,
      });
    });

    it("should throw an error when updating a payment with existing code", async () => {
      const existsPayment = await createPaymentHelper(testingModule);
      const payment = await createPaymentHelper(testingModule);

      const dto: UpdatePaymentDto = {
        code: existsPayment.code,
      };

      const updatePaymentResponse = await api.updatePayment(payment.uuid, dto);

      expect(updatePaymentResponse.status).toEqual(400);
      expect(updatePaymentResponse.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: `The payment with the ${dto.code} code already exists`,
      });
    });
  });

  describe("[Delete] /payments", () => {
    it("should successfully delete a payment", async () => {
      const payment = await createPaymentHelper(testingModule);

      const deletePaymentResponse = await api.deletePayment(payment.uuid);

      expect(deletePaymentResponse.status).toEqual(200);
      expect(deletePaymentResponse.body).toEqual({
        statusCode: 200,
      });
    });

    it("should throw an error when deleting a payment that does not exists", async () => {
      const fakePaymentUUID = faker.datatype.uuid();

      const deletePaymentResponse = await api.deletePayment(fakePaymentUUID);

      expect(deletePaymentResponse.status).toEqual(404);
      expect(deletePaymentResponse.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: `The payment ${fakePaymentUUID} does not exist`,
      });
    });
  });
});
