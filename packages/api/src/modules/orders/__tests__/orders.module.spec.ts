import { faker } from "@faker-js/faker";
import ModifierEntity from "~/db/entities/modifier.entity";
import ProductEntity from "~/db/entities/product.entity";
import { DeliveryFactory } from "~/db/seeders/delivery.seeder";
import { ModifiersFactory } from "~/db/seeders/modifier.seeder";
import { PaymentFactory } from "~/db/seeders/payment.seeder";
import { ProductsFactory } from "~/db/seeders/product.seeder";
import DeliveriesService from "~/modules/delivery/deliveries.service";
import DiscountsService from "~/modules/discounts/discounts.service";
import ModifiersService from "~/modules/modifiers/modifiers.service";
import PaymentService from "~/modules/payment/payment.service";
import ProductsService from "~/modules/products/products.service";
import { MakeAnOrderDto, OrderedProduct } from "../orders.dto";
import OrdersService, {
  FIXED_DELIVERY_COUNT,
  FIXED_MODIFIER_COUNT,
} from "../orders.service";
import UnitTestingModule from "./helpers/testing-module.unit.helper";
import { stringifyHouseInfo } from "../utils/stringifyHouseInfo";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { BadRequestException } from "@nestjs/common";
import ShoppingCartSettingsService from "~/modules/shopping-cart-settings/shopping-cart-settings.service";
import {
  DeliveryCriteriaEnum,
  DeliveryOperatorEnum,
  DeliveryTypeEnum,
} from "@monorepo/common";

interface IFormDataMock {
  append: jest.Mock;
}

function FormDataMock() {
  this.append = jest.fn();
}

jest.mock("form-data", () => FormDataMock);

describe("[Orders Module] ...", () => {
  let testingModule: UnitTestingModule;
  let orderService: OrdersService;
  let deliveriesService: DeliveriesService;
  let paymentService: PaymentService;
  let shoppingCartSettingsService: ShoppingCartSettingsService;
  const productsFactory: ProductsFactory = new ProductsFactory();
  const modifiersFactory: ModifiersFactory = new ModifiersFactory();
  const deliveriesFactory: DeliveryFactory = new DeliveryFactory();
  const paymentFactory: PaymentFactory = new PaymentFactory();
  let sendToFrontPadWrapper: jest.SpyInstance;
  let findProductsWrapper: jest.SpyInstance;
  let findModifiersWrapper: jest.SpyInstance;
  let findOneDeliveryWrapper: jest.SpyInstance;
  let getAvailableDeliveriesWrapper: jest.SpyInstance;
  let calculateDiscountWrapper: jest.SpyInstance;
  let findOneOrFailPaymentWrapper: jest.SpyInstance;
  let getSettings: jest.SpyInstance;

  beforeAll(async () => {
    testingModule = new UnitTestingModule();

    await testingModule.init();

    orderService = testingModule.get<OrdersService>(OrdersService);

    orderService.sendToFrontPad = jest.fn();
    sendToFrontPadWrapper = jest.spyOn(orderService, "sendToFrontPad");

    const productsService = testingModule.get<ProductsService>(ProductsService);
    findProductsWrapper = jest.spyOn(productsService, "find");

    const modifiersService =
      testingModule.get<ModifiersService>(ModifiersService);
    findModifiersWrapper = jest.spyOn(modifiersService, "find");

    const discountsService =
      testingModule.get<DiscountsService>(DiscountsService);
    calculateDiscountWrapper = jest.spyOn(discountsService, "calculate");

    deliveriesService = testingModule.get<DeliveriesService>(DeliveriesService);
    findOneDeliveryWrapper = jest.spyOn(deliveriesService, "findOne");
    getAvailableDeliveriesWrapper = jest.spyOn(
      deliveriesService,
      "getAvailableDeliveries"
    );

    paymentService = testingModule.get<PaymentService>(PaymentService);
    findOneOrFailPaymentWrapper = jest.spyOn(paymentService, "findOneOrFail");

    shoppingCartSettingsService =
      testingModule.get<ShoppingCartSettingsService>(
        ShoppingCartSettingsService
      );
    getSettings = jest.spyOn(shoppingCartSettingsService, "getSettings");
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should correct make an order", async () => {
    const TEST_SEND_TO_FRONT_PAD_RESULT = { result: "ok" };
    const TEST_MINIMUM_ORDER_AMOUNT = 1000;
    const TEST_DISCOUNT = 100;
    const TEST_DELIVERY = deliveriesFactory.create({
      type: DeliveryTypeEnum.IN_CASH,
    });
    const TEST_PAYMENT = paymentFactory.create();

    const orderedProducts = (5).map(() =>
      productsFactory.create({
        category_uuid: faker.datatype.uuid(),
      })
    );

    findProductsWrapper.mockResolvedValueOnce(orderedProducts);

    const usedModifiers = (5).map(() =>
      modifiersFactory.create({
        category_uuid: faker.datatype.uuid(),
      })
    );

    findModifiersWrapper.mockResolvedValueOnce(usedModifiers);

    getAvailableDeliveriesWrapper.mockResolvedValueOnce([TEST_DELIVERY]);

    findOneDeliveryWrapper.mockResolvedValueOnce(TEST_DELIVERY);

    findOneOrFailPaymentWrapper.mockResolvedValueOnce(TEST_PAYMENT);

    getSettings.mockResolvedValueOnce({
      minimum_order_amount: TEST_MINIMUM_ORDER_AMOUNT,
    });

    const dto: MakeAnOrderDto = {
      products: orderedProducts.map<OrderedProduct>(p => ({
        uuid: p.uuid,
        count: faker.datatype.number({ max: 10, min: 1 }),
        modifiers: [
          usedModifiers[
            faker.datatype.number({ min: 0, max: usedModifiers.length - 1 })
          ],
        ],
      })),
      delivery_uuid: TEST_DELIVERY.uuid,
      delivery_address: {
        street: faker.datatype.uuid(),
        house: faker.datatype.uuid(),
        building: faker.datatype.uuid(),
        entrance: faker.datatype.number({ max: 99, min: 0 }),
        floor: faker.datatype.number({ max: 99, min: 0 }),
        apartment: faker.datatype.number({ max: 99, min: 0 }),
      },
      payment_uuid: TEST_PAYMENT.uuid,
      client_info: {
        name: faker.datatype.uuid(),
        phone: faker.datatype.uuid(),
      },
    };

    sendToFrontPadWrapper.mockResolvedValueOnce(TEST_SEND_TO_FRONT_PAD_RESULT);
    calculateDiscountWrapper.mockResolvedValueOnce(TEST_DISCOUNT);

    const makeAnOrderResult = await orderService.makeAnOrder(dto);

    expect(makeAnOrderResult).toEqual(TEST_SEND_TO_FRONT_PAD_RESULT);
    expect(sendToFrontPadWrapper).toBeCalled();

    const payload = sendToFrontPadWrapper.mock.calls[0][0] as IFormDataMock;

    let orderCost = 0;
    let currentProductIndex = 0;
    let callsCount = 0;

    for (const product of dto.products) {
      const foundProduct = orderedProducts.find(
        p => p.uuid === product.uuid
      ) as ProductEntity;

      const productIndex = currentProductIndex++;

      expect(payload.append).toBeCalledWith(
        `product[${productIndex}]`,
        foundProduct.article_number
      );
      expect(payload.append).toBeCalledWith(
        `product_kol[${productIndex}]`,
        product.count
      );
      expect(payload.append).toBeCalledWith(
        `product_price[${productIndex}]`,
        foundProduct.price
      );

      let fullProductPrice = foundProduct.price;

      callsCount += 3;

      for (const modifier of product.modifiers) {
        const foundModifier = usedModifiers.find(
          m => m.uuid === modifier.uuid
        ) as ModifierEntity;

        const modifierIndex = currentProductIndex++;

        expect(payload.append).toBeCalledWith(
          `product[${modifierIndex}]`,
          foundModifier.article_number
        );
        expect(payload.append).toBeCalledWith(
          `product_kol[${modifierIndex}]`,
          FIXED_MODIFIER_COUNT
        );
        expect(payload.append).toBeCalledWith(
          `product_price[${modifierIndex}]`,
          foundModifier.price
        );
        expect(payload.append).toBeCalledWith(
          `product_mod[${modifierIndex}]`,
          productIndex
        );

        fullProductPrice += foundModifier.price;

        callsCount += 4;
      }

      fullProductPrice *= product.count;

      orderCost += fullProductPrice;
    }

    const deliveryIndex = currentProductIndex++;

    expect(payload.append).toBeCalledWith(
      `product[${deliveryIndex}]`,
      TEST_DELIVERY.article_number
    );
    expect(payload.append).toBeCalledWith(
      `product_kol[${deliveryIndex}]`,
      FIXED_DELIVERY_COUNT
    );
    expect(payload.append).toBeCalledWith(
      `product_price[${deliveryIndex}]`,
      deliveriesService.calculate(TEST_DELIVERY, {
        orderCost,
      })
    );

    expect(payload.append).toBeCalledWith("sale_amount", TEST_DISCOUNT);
    expect(payload.append).toBeCalledWith(
      "street",
      dto.delivery_address.street
    );

    expect(payload.append).toBeCalledWith("pay", TEST_PAYMENT.code);

    expect(payload.append).toBeCalledWith(
      "home",
      stringifyHouseInfo({
        house: dto.delivery_address.house,
        building: dto.delivery_address.building,
      })
    );
    expect(payload.append).toBeCalledWith("pod", dto.delivery_address.entrance);
    expect(payload.append).toBeCalledWith("et", dto.delivery_address.floor);
    expect(payload.append).toBeCalledWith(
      "apart",
      dto.delivery_address.apartment
    );
    expect(payload.append).toBeCalledWith("name", dto.client_info.name);
    expect(payload.append).toBeCalledWith("phone", dto.client_info.phone);
    expect(payload.append).toBeCalledWith("mail", dto.client_info.email ?? "");
    expect(payload.append).toBeCalledWith("descr", dto.description ?? "");

    callsCount += 14;

    expect(payload.append).toBeCalledTimes(callsCount);
  });

  it("should throw an error when the product not found", async () => {
    const TEST_FAKE_PRODUCT_UUID = faker.datatype.uuid();
    const TEST_PAYMENT = {
      ...paymentFactory.create(),
      uuid: faker.datatype.uuid(),
    };

    const orderedProducts = (5).map(() =>
      productsFactory.create({
        category_uuid: faker.datatype.uuid(),
      })
    );

    findProductsWrapper.mockResolvedValueOnce(orderedProducts);

    const usedModifiers = (5).map(() =>
      modifiersFactory.create({
        category_uuid: faker.datatype.uuid(),
      })
    );

    findModifiersWrapper.mockResolvedValueOnce(usedModifiers);

    getAvailableDeliveriesWrapper.mockResolvedValueOnce([]);

    findOneOrFailPaymentWrapper.mockResolvedValueOnce(TEST_PAYMENT);

    const dto: MakeAnOrderDto = {
      products: [
        ...orderedProducts,
        { uuid: TEST_FAKE_PRODUCT_UUID },
      ].map<OrderedProduct>(p => ({
        uuid: p.uuid,
        count: faker.datatype.number({ max: 10, min: 1 }),
        modifiers: [
          usedModifiers[
            faker.datatype.number({ min: 0, max: usedModifiers.length - 1 })
          ],
        ],
      })),
      delivery_address: {
        street: faker.datatype.uuid(),
        house: faker.datatype.uuid(),
        building: faker.datatype.uuid(),
        entrance: faker.datatype.number({ max: 99, min: 0 }),
        floor: faker.datatype.number({ max: 99, min: 0 }),
        apartment: faker.datatype.number({ max: 99, min: 0 }),
      },
      payment_uuid: TEST_PAYMENT.uuid,
      client_info: {
        name: faker.datatype.uuid(),
        phone: faker.datatype.uuid(),
      },
    };

    expect(orderService.makeAnOrder(dto)).rejects.toThrow(
      `The product ${TEST_FAKE_PRODUCT_UUID} does not found`
    );
  });

  it("should throw an error when the modifier not found", async () => {
    const TEST_FAKE_MODIFIER_UUID = faker.datatype.uuid();
    const TEST_PAYMENT = {
      ...paymentFactory.create(),
      uuid: faker.datatype.uuid(),
    };

    const orderedProducts = (5).map(() =>
      productsFactory.create({
        category_uuid: faker.datatype.uuid(),
      })
    );

    findProductsWrapper.mockResolvedValueOnce(orderedProducts);

    const usedModifiers = (5).map(() =>
      modifiersFactory.create({
        category_uuid: faker.datatype.uuid(),
      })
    );

    findModifiersWrapper.mockResolvedValueOnce(usedModifiers);

    getAvailableDeliveriesWrapper.mockResolvedValueOnce([]);

    findOneOrFailPaymentWrapper.mockResolvedValueOnce(TEST_PAYMENT);

    const dto: MakeAnOrderDto = {
      products: orderedProducts.map<OrderedProduct>(p => ({
        uuid: p.uuid,
        count: faker.datatype.number({ max: 10, min: 1 }),
        modifiers: [
          usedModifiers[
            faker.datatype.number({ min: 0, max: usedModifiers.length - 1 })
          ],
          { uuid: TEST_FAKE_MODIFIER_UUID },
        ],
      })),
      delivery_address: {
        street: faker.datatype.uuid(),
        house: faker.datatype.uuid(),
        building: faker.datatype.uuid(),
        entrance: faker.datatype.number({ max: 99, min: 0 }),
        floor: faker.datatype.number({ max: 99, min: 0 }),
        apartment: faker.datatype.number({ max: 99, min: 0 }),
      },
      payment_uuid: TEST_PAYMENT.uuid,
      client_info: {
        name: faker.datatype.uuid(),
        phone: faker.datatype.uuid(),
      },
    };

    expect(orderService.makeAnOrder(dto)).rejects.toThrow(
      `The modifier ${TEST_FAKE_MODIFIER_UUID} does not found`
    );
  });

  it("should throw an error when the delivery was not provided, but the available deliveries exits", async () => {
    const TEST_FAKE_DELIVERY_UUID = faker.datatype.uuid();
    const TEST_MINIMUM_ORDER_AMOUNT = 1000;
    const orderedProducts = (5).map(() =>
      productsFactory.create({
        category_uuid: faker.datatype.uuid(),
      })
    );
    const TEST_PAYMENT = paymentFactory.create();

    findProductsWrapper.mockResolvedValueOnce(orderedProducts);

    const usedModifiers = (5).map(() =>
      modifiersFactory.create({
        category_uuid: faker.datatype.uuid(),
      })
    );

    findModifiersWrapper.mockResolvedValueOnce(usedModifiers);

    findOneOrFailPaymentWrapper.mockResolvedValueOnce(TEST_PAYMENT);

    getAvailableDeliveriesWrapper.mockResolvedValueOnce([
      deliveriesFactory.create(),
    ]);

    getSettings.mockResolvedValueOnce({
      minimum_order_amount: TEST_MINIMUM_ORDER_AMOUNT,
    });

    const dto: MakeAnOrderDto = {
      products: orderedProducts.map<OrderedProduct>(p => ({
        uuid: p.uuid,
        count: faker.datatype.number({ max: 10, min: 1 }),
        modifiers: [
          usedModifiers[
            faker.datatype.number({ min: 0, max: usedModifiers.length - 1 })
          ],
        ],
      })),
      delivery_uuid: TEST_FAKE_DELIVERY_UUID,
      delivery_address: {
        street: faker.datatype.uuid(),
        house: faker.datatype.uuid(),
        building: faker.datatype.uuid(),
        entrance: faker.datatype.number({ max: 99, min: 0 }),
        floor: faker.datatype.number({ max: 99, min: 0 }),
        apartment: faker.datatype.number({ max: 99, min: 0 }),
      },
      payment_uuid: TEST_PAYMENT.uuid,
      client_info: {
        name: faker.datatype.uuid(),
        phone: faker.datatype.uuid(),
      },
    };

    expect(orderService.makeAnOrder(dto)).rejects.toThrow(
      `There are available deliveries, but no one delivery was not provided`
    );
  });

  it("should throw an error when the delivery is not available", async () => {
    const TEST_MINIMUM_ORDER_AMOUNT = 1000;
    const TEST_NOT_AVAILABLE_DELIVERY = {
      ...deliveriesFactory.create(),
      uuid: faker.datatype.uuid(),
    };
    const TEST_PAYMENT = {
      ...paymentFactory.create(),
      uuid: faker.datatype.uuid(),
    };

    const orderedProducts = (5).map(() =>
      productsFactory.create({
        category_uuid: faker.datatype.uuid(),
      })
    );

    findProductsWrapper.mockResolvedValueOnce(orderedProducts);

    const usedModifiers = (5).map(() =>
      modifiersFactory.create({
        category_uuid: faker.datatype.uuid(),
      })
    );

    findModifiersWrapper.mockResolvedValueOnce(usedModifiers);

    getAvailableDeliveriesWrapper.mockResolvedValueOnce([
      deliveriesFactory.create(),
    ]);

    findOneDeliveryWrapper.mockResolvedValueOnce(TEST_NOT_AVAILABLE_DELIVERY);

    findOneOrFailPaymentWrapper.mockResolvedValueOnce(TEST_PAYMENT);

    getSettings.mockResolvedValueOnce({
      minimum_order_amount: TEST_MINIMUM_ORDER_AMOUNT,
    });

    const dto: MakeAnOrderDto = {
      products: orderedProducts.map<OrderedProduct>(p => ({
        uuid: p.uuid,
        count: faker.datatype.number({ max: 10, min: 1 }),
        modifiers: [
          usedModifiers[
            faker.datatype.number({ min: 0, max: usedModifiers.length - 1 })
          ],
        ],
      })),
      delivery_uuid: TEST_NOT_AVAILABLE_DELIVERY.uuid,
      delivery_address: {
        street: faker.datatype.uuid(),
        house: faker.datatype.uuid(),
        building: faker.datatype.uuid(),
        entrance: faker.datatype.number({ max: 99, min: 0 }),
        floor: faker.datatype.number({ max: 99, min: 0 }),
        apartment: faker.datatype.number({ max: 99, min: 0 }),
      },
      payment_uuid: TEST_PAYMENT.uuid,
      client_info: {
        name: faker.datatype.uuid(),
        phone: faker.datatype.uuid(),
      },
    };

    expect(orderService.makeAnOrder(dto)).rejects.toThrow(
      `The delivery ${TEST_NOT_AVAILABLE_DELIVERY.uuid} not available`
    );
  });

  it("should throw an error when the cost of the order is too low", async () => {
    const TEST_SEND_TO_FRONT_PAD_RESULT = {
      result: "ok",
    };
    const TEST_MINIMUM_ORDER_AMOUNT = 1000;
    const TEST_DISCOUNT = 0;
    const TEST_DELIVERY = deliveriesFactory.create({
      type: DeliveryTypeEnum.IN_CASH,
      condition: {
        criteria: DeliveryCriteriaEnum.COUNT,
        op: DeliveryOperatorEnum.GREATER,
        value: 0,
      },
      value: 100,
    });
    const TEST_PAYMENT = paymentFactory.create();

    const orderedProducts = (5).map(() =>
      productsFactory.create({
        category_uuid: faker.datatype.uuid(),
        price: 100,
      })
    );

    findProductsWrapper.mockResolvedValueOnce(orderedProducts);

    const usedModifiers = (5).map(() =>
      modifiersFactory.create({
        category_uuid: faker.datatype.uuid(),
      })
    );

    findModifiersWrapper.mockResolvedValueOnce(usedModifiers);
    findModifiersWrapper.mockResolvedValueOnce(usedModifiers);

    getAvailableDeliveriesWrapper.mockResolvedValueOnce([TEST_DELIVERY]);

    findOneDeliveryWrapper.mockResolvedValueOnce(TEST_DELIVERY);

    findOneOrFailPaymentWrapper.mockResolvedValueOnce(TEST_PAYMENT);
    getSettings.mockResolvedValueOnce({
      minimum_order_amount: TEST_MINIMUM_ORDER_AMOUNT,
    });

    sendToFrontPadWrapper.mockResolvedValueOnce(TEST_SEND_TO_FRONT_PAD_RESULT);
    calculateDiscountWrapper.mockResolvedValueOnce(TEST_DISCOUNT);

    const dto: MakeAnOrderDto = {
      products: orderedProducts.map<OrderedProduct>(p => ({
        uuid: p.uuid,
        count: 1,
        modifiers: [],
      })),
      delivery_uuid: TEST_DELIVERY.uuid,
      delivery_address: {
        street: faker.datatype.uuid(),
        house: faker.datatype.uuid(),
        building: faker.datatype.uuid(),
        entrance: faker.datatype.number({ max: 99, min: 0 }),
        floor: faker.datatype.number({ max: 99, min: 0 }),
        apartment: faker.datatype.number({ max: 99, min: 0 }),
      },
      payment_uuid: TEST_PAYMENT.uuid,
      client_info: {
        name: faker.datatype.uuid(),
        phone: faker.datatype.uuid(),
      },
    };

    expect(orderService.makeAnOrder(dto)).rejects.toThrow(
      new BadRequestException("The cost of the order is too low")
    );
  });

  it("should not throw an error when the cost of the order passes the minimum", async () => {
    const TEST_SEND_TO_FRONT_PAD_RESULT = {
      result: "ok",
    };
    const TEST_MINIMUM_ORDER_AMOUNT = 1000;
    const TEST_DISCOUNT = 0;
    const TEST_DELIVERY = deliveriesFactory.create({
      type: DeliveryTypeEnum.IN_CASH,
      condition: {
        criteria: DeliveryCriteriaEnum.COUNT,
        op: DeliveryOperatorEnum.GREATER,
        value: 0,
      },
      value: 100,
    });
    const TEST_PAYMENT = {
      ...paymentFactory.create(),
      uuid: faker.datatype.uuid(),
    };

    const orderedProducts = (5).map(() =>
      productsFactory.create({
        category_uuid: faker.datatype.uuid(),
        price: 180,
      })
    );

    findProductsWrapper.mockResolvedValueOnce(orderedProducts);

    const usedModifiers = (5).map(() =>
      modifiersFactory.create({
        category_uuid: faker.datatype.uuid(),
      })
    );

    findModifiersWrapper.mockResolvedValueOnce(usedModifiers);
    findModifiersWrapper.mockResolvedValueOnce(usedModifiers);

    getAvailableDeliveriesWrapper.mockResolvedValueOnce([TEST_DELIVERY]);

    findOneDeliveryWrapper.mockResolvedValueOnce(TEST_DELIVERY);

    findOneOrFailPaymentWrapper.mockResolvedValueOnce(TEST_PAYMENT);
    getSettings.mockResolvedValueOnce({
      minimum_order_amount: TEST_MINIMUM_ORDER_AMOUNT,
    });

    sendToFrontPadWrapper.mockResolvedValueOnce(TEST_SEND_TO_FRONT_PAD_RESULT);
    calculateDiscountWrapper.mockResolvedValueOnce(TEST_DISCOUNT);

    const dto: MakeAnOrderDto = {
      products: orderedProducts.map<OrderedProduct>(p => ({
        uuid: p.uuid,
        count: 1,
        modifiers: [],
      })),
      delivery_uuid: TEST_DELIVERY.uuid,
      delivery_address: {
        street: faker.datatype.uuid(),
        house: faker.datatype.uuid(),
        building: faker.datatype.uuid(),
        entrance: faker.datatype.number({ max: 99, min: 0 }),
        floor: faker.datatype.number({ max: 99, min: 0 }),
        apartment: faker.datatype.number({ max: 99, min: 0 }),
      },
      payment_uuid: TEST_PAYMENT.uuid,
      client_info: {
        name: faker.datatype.uuid(),
        phone: faker.datatype.uuid(),
      },
    };

    expect(orderService.makeAnOrder(dto)).resolves.toEqual(
      TEST_SEND_TO_FRONT_PAD_RESULT
    );
  });

  it("should perform 'trim' for all string fields", async () => {
    const obj = plainToInstance(MakeAnOrderDto, {
      products: [],
      delivery_uuid: faker.datatype.uuid(),
      delivery_address: {
        street: `   ${faker.datatype.string()}     `,
        house: ` ${faker.datatype.string()}  `,
        building: ` ${faker.datatype.string()}  `,
        entrance: faker.datatype.number({ max: 99, min: 0 }),
        floor: faker.datatype.number({ max: 99, min: 0 }),
        apartment: faker.datatype.number({ max: 99, min: 0 }),
      },
      payment_uuid: faker.datatype.uuid(),
      client_info: {
        name: `   ${faker.datatype.string()}     `,
        phone: `   ${faker.phone.number("+7 (961) ###-##-##")}     `,
      },
    });

    const errors = await validate(obj);

    expect(errors).toHaveLength(0);
    expect(obj.delivery_address.street).toEqual(
      obj.delivery_address.street.trim()
    );
    expect(obj.delivery_address.house).toEqual(
      obj.delivery_address.house.trim()
    );
    expect(obj.delivery_address.building).toEqual(
      obj.delivery_address.building?.trim()
    );
    expect(obj.client_info.name).toEqual(obj.client_info.name.trim());
    expect(obj.client_info.phone).toEqual(obj.client_info.phone.trim());
  });
});
