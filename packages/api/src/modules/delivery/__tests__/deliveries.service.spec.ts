import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import DeliveryEntity, {
  DeliveryCriteriaEnum,
  DeliveryOperatorEnum,
  DeliveryTypeEnum,
} from "~/db/entities/delivery.entity";
import { DeliveryFactory } from "~/db/seeds/delivery.seed";
import DeliveriesService from "../deliveries.service";
import UnitTestingModule from "./helpers/testing-module.unit.helper";

describe("[Unit] [Delivery Service] ...", () => {
  let testingModule: UnitTestingModule;
  let deliveriesRepository: Repository<DeliveryEntity>;
  let deliveriesService: DeliveriesService;
  const deliveryFactory = new DeliveryFactory();

  beforeAll(async () => {
    testingModule = new UnitTestingModule();

    await testingModule.init();

    deliveriesService = testingModule.get<DeliveriesService>(DeliveriesService);
    deliveriesRepository = testingModule.get<Repository<DeliveryEntity>>(
      getRepositoryToken(DeliveryEntity)
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe("[Calculating] ...", () => {
    describe("should return preffered deliveries", () => {
      it("by order cost", async () => {
        const TEST_ORDER_COST = 1000;
        const TEST_ORDERED_PRODUCT_COUNT = 5;
        const TEST_DELIVERIES = [
          deliveryFactory.create({
            condition: {
              criteria: DeliveryCriteriaEnum.PRICE,
              op: DeliveryOperatorEnum.GREATER,
              value: 700,
            },
          }),
        ];

        jest
          .spyOn(deliveriesRepository, "find")
          .mockResolvedValueOnce(TEST_DELIVERIES);

        const availableDeliveries =
          await deliveriesService.getAvailableDeliveries({
            orderCost: TEST_ORDER_COST,
            orderedProductsCount: TEST_ORDERED_PRODUCT_COUNT,
          });

        expect(availableDeliveries).toEqual(TEST_DELIVERIES);
      });
    });

    it("by ordered products count", async () => {
      const TEST_ORDER_COST = 1000;
      const TEST_ORDERED_PRODUCT_COUNT = 5;
      const TEST_DELIVERIES = [
        deliveryFactory.create({
          condition: {
            criteria: DeliveryCriteriaEnum.COUNT,
            op: DeliveryOperatorEnum.GREATER,
            value: 2,
          },
        }),
      ];

      jest
        .spyOn(deliveriesRepository, "find")
        .mockResolvedValueOnce(TEST_DELIVERIES);

      const availableDeliveries =
        await deliveriesService.getAvailableDeliveries({
          orderCost: TEST_ORDER_COST,
          orderedProductsCount: TEST_ORDERED_PRODUCT_COUNT,
        });

      expect(availableDeliveries).toEqual(TEST_DELIVERIES);
    });
  });

  describe("should not return delivery when no one delivery is not available", () => {
    it("by order cost", async () => {
      const TEST_ORDER_COST = 900;
      const TEST_ORDERED_PRODUCT_COUNT = 10;
      const TEST_DELIVERIES = [
        deliveryFactory.create({
          condition: {
            criteria: DeliveryCriteriaEnum.PRICE,
            op: DeliveryOperatorEnum.GREATER,
            value: 1000,
          },
        }),
      ];

      const findDeliveriesWrapper = jest
        .spyOn(deliveriesRepository, "find")
        .mockResolvedValueOnce(TEST_DELIVERIES);

      const availableDeliveries =
        await deliveriesService.getAvailableDeliveries({
          orderCost: TEST_ORDER_COST,
          orderedProductsCount: TEST_ORDERED_PRODUCT_COUNT,
        });

      expect(availableDeliveries).toEqual([]);
      expect(findDeliveriesWrapper).toBeCalled();
    });
  });

  it("by ordered porducts count", async () => {
    const TEST_ORDER_COST = 1000;
    const TEST_ORDERED_PRODUCT_COUNT = 10;
    const TEST_DELIVERIES = [
      deliveryFactory.create({
        condition: {
          criteria: DeliveryCriteriaEnum.COUNT,
          op: DeliveryOperatorEnum.GREATER,
          value: 50,
        },
      }),
    ];

    const findDeliveriesWrapper = jest
      .spyOn(deliveriesRepository, "find")
      .mockResolvedValueOnce(TEST_DELIVERIES);

    const availableDeliveries = await deliveriesService.getAvailableDeliveries({
      orderCost: TEST_ORDER_COST,
      orderedProductsCount: TEST_ORDERED_PRODUCT_COUNT,
    });

    expect(availableDeliveries).toEqual([]);
    expect(findDeliveriesWrapper).toBeCalled();
  });

  it("should return several available deliveries when the deliveries is crossing. And also sort by the most profitably", async () => {
    const TEST_ORDER_COST = 5000;
    const TEST_ORDERED_PRODUCT_COUNT = -1;
    const TEST_DELIVERIES = [
      deliveryFactory.create({
        condition: {
          criteria: DeliveryCriteriaEnum.PRICE,
          op: DeliveryOperatorEnum.BETWEEN,
          value: 0,
          value2: 5000,
        },
        type: DeliveryTypeEnum.PERCENT,
        value: 3,
      }),
      deliveryFactory.create({
        condition: {
          criteria: DeliveryCriteriaEnum.PRICE,
          op: DeliveryOperatorEnum.BETWEEN,
          value: 5000,
          value2: 10000,
        },
        type: DeliveryTypeEnum.PERCENT,
        value: 5,
      }),
    ];

    const findDeliveriesWrapper = jest
      .spyOn(deliveriesRepository, "find")
      .mockResolvedValueOnce(TEST_DELIVERIES);

    const availableDeliveries = await deliveriesService.getAvailableDeliveries({
      orderCost: TEST_ORDER_COST,
      orderedProductsCount: TEST_ORDERED_PRODUCT_COUNT,
    });

    expect(availableDeliveries).toEqual([
      TEST_DELIVERIES[1],
      TEST_DELIVERIES[0],
    ]);
    expect(findDeliveriesWrapper).toBeCalled();
  });

  describe("should return the most profitably deliveries", () => {
    it("percent by percent^", async () => {
      const TEST_ORDER_COST = 1000;
      const TEST_ORDERED_PRODUCT_COUNT = 10;
      const TEST_DELIVERIES = [
        deliveryFactory.create({
          condition: {
            criteria: DeliveryCriteriaEnum.COUNT,
            op: DeliveryOperatorEnum.BETWEEN,
            value: 0,
            value2: 10,
          },
          type: DeliveryTypeEnum.PERCENT,
          value: 2,
        }),
        deliveryFactory.create({
          condition: {
            criteria: DeliveryCriteriaEnum.COUNT,
            op: DeliveryOperatorEnum.BETWEEN,
            value: 10,
            value2: 50,
          },
          type: DeliveryTypeEnum.PERCENT,
          value: 7,
        }),
      ];

      const findDeliveriesWrapper = jest
        .spyOn(deliveriesRepository, "find")
        .mockResolvedValueOnce(TEST_DELIVERIES);

      const availableDeliveries =
        await deliveriesService.getAvailableDeliveries({
          orderCost: TEST_ORDER_COST,
          orderedProductsCount: TEST_ORDERED_PRODUCT_COUNT,
        });

      expect(availableDeliveries).toEqual([
        TEST_DELIVERIES[1],
        TEST_DELIVERIES[0],
      ]);
      expect(findDeliveriesWrapper).toBeCalled();
    });

    it("percent by value^", async () => {
      const TEST_ORDER_COST = 1000;
      const TEST_ORDERED_PRODUCT_COUNT = 10;
      const TEST_DELIVERIES = [
        deliveryFactory.create({
          condition: {
            criteria: DeliveryCriteriaEnum.COUNT,
            op: DeliveryOperatorEnum.BETWEEN,
            value: 0,
            value2: 10,
          },
          type: DeliveryTypeEnum.IN_CASH,
          value: 200,
        }),
        deliveryFactory.create({
          condition: {
            criteria: DeliveryCriteriaEnum.COUNT,
            op: DeliveryOperatorEnum.BETWEEN,
            value: 10,
            value2: 50,
          },
          type: DeliveryTypeEnum.PERCENT,
          value: 2,
        }),
      ];

      const findDeliveriesWrapper = jest
        .spyOn(deliveriesRepository, "find")
        .mockResolvedValueOnce(TEST_DELIVERIES);

      const availableDeliveries =
        await deliveriesService.getAvailableDeliveries({
          orderCost: TEST_ORDER_COST,
          orderedProductsCount: TEST_ORDERED_PRODUCT_COUNT,
        });

      expect(availableDeliveries).toEqual([
        TEST_DELIVERIES[0],
        TEST_DELIVERIES[1],
      ]);
      expect(findDeliveriesWrapper).toBeCalled();
    });

    it("value by value^", async () => {
      const TEST_ORDER_COST = 1000;
      const TEST_ORDERED_PRODUCT_COUNT = 10;
      const TEST_DELIVERIES = [
        deliveryFactory.create({
          condition: {
            criteria: DeliveryCriteriaEnum.COUNT,
            op: DeliveryOperatorEnum.BETWEEN,
            value: 0,
            value2: 10,
          },
          type: DeliveryTypeEnum.IN_CASH,
          value: 200,
        }),
        deliveryFactory.create({
          condition: {
            criteria: DeliveryCriteriaEnum.COUNT,
            op: DeliveryOperatorEnum.BETWEEN,
            value: 10,
            value2: 50,
          },
          type: DeliveryTypeEnum.IN_CASH,
          value: 250,
        }),
      ];

      const findDeliveriesWrapper = jest
        .spyOn(deliveriesRepository, "find")
        .mockResolvedValueOnce(TEST_DELIVERIES);

      const availableDeliveries =
        await deliveriesService.getAvailableDeliveries({
          orderCost: TEST_ORDER_COST,
          orderedProductsCount: TEST_ORDERED_PRODUCT_COUNT,
        });

      expect(availableDeliveries).toEqual([
        TEST_DELIVERIES[1],
        TEST_DELIVERIES[0],
      ]);
      expect(findDeliveriesWrapper).toBeCalled();
    });
  });

  it("should return true when delivery is available", async () => {
    const TEST_ORDER_COST = 1000;
    const TEST_ORDERED_PRODUCT_COUNT = 10;
    const TEST_DELIVERIES = [
      deliveryFactory.create({
        condition: {
          criteria: DeliveryCriteriaEnum.COUNT,
          op: DeliveryOperatorEnum.BETWEEN,
          value: 0,
          value2: 10,
        },
        type: DeliveryTypeEnum.IN_CASH,
        value: 200,
      }),
      deliveryFactory.create({
        condition: {
          criteria: DeliveryCriteriaEnum.COUNT,
          op: DeliveryOperatorEnum.BETWEEN,
          value: 10,
          value2: 50,
        },
        type: DeliveryTypeEnum.IN_CASH,
        value: 250,
      }),
    ];

    const findDeliveriesWrapper = jest
      .spyOn(deliveriesRepository, "find")
      .mockResolvedValueOnce(TEST_DELIVERIES);

    expect(
      await deliveriesService.isAvailableDelivery(TEST_DELIVERIES[1], {
        orderCost: TEST_ORDER_COST,
        orderedProductsCount: TEST_ORDERED_PRODUCT_COUNT,
      })
    ).toBeTruthy();
    expect(findDeliveriesWrapper).toBeCalled();
  });

  it("should return false when delivery is not available", async () => {
    const TEST_ORDER_COST = 1000;
    const TEST_ORDERED_PRODUCT_COUNT = 10;
    const TEST_NOT_AVAILABLE_DELIVERY = deliveryFactory.create({
      condition: {
        criteria: DeliveryCriteriaEnum.COUNT,
        op: DeliveryOperatorEnum.LESS,
        value: 10,
      },
      type: DeliveryTypeEnum.PERCENT,
      value: 1,
    });

    const TEST_DELIVERIES = [
      TEST_NOT_AVAILABLE_DELIVERY,
      deliveryFactory.create({
        condition: {
          criteria: DeliveryCriteriaEnum.COUNT,
          op: DeliveryOperatorEnum.BETWEEN,
          value: 0,
          value2: 10,
        },
        type: DeliveryTypeEnum.IN_CASH,
        value: 200,
      }),
      deliveryFactory.create({
        condition: {
          criteria: DeliveryCriteriaEnum.COUNT,
          op: DeliveryOperatorEnum.BETWEEN,
          value: 10,
          value2: 50,
        },
        type: DeliveryTypeEnum.IN_CASH,
        value: 250,
      }),
    ];

    const findDeliveriesWrapper = jest
      .spyOn(deliveriesRepository, "find")
      .mockResolvedValueOnce(TEST_DELIVERIES);

    expect(
      await deliveriesService.isAvailableDelivery(TEST_NOT_AVAILABLE_DELIVERY, {
        orderCost: TEST_ORDER_COST,
        orderedProductsCount: TEST_ORDERED_PRODUCT_COUNT,
      })
    ).toBeFalsy();
    expect(findDeliveriesWrapper).toBeCalled();
  });
});
