import { faker } from "@faker-js/faker";
import ModifierEntity from "~/db/entities/modifier.entity";
import ProductEntity from "~/db/entities/product.entity";
import { DeliveryFactory } from "~/db/seeds/delivery.seed";
import { ModifiersFactory } from "~/db/seeds/modifier.seed";
import { PaymentFactory } from "~/db/seeds/payment.seed";
import { ProductsFactory } from "~/db/seeds/product.seed";
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
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should correct make an order", async () => {
    const TEST_SEND_TO_FRONT_PAD_RESULT = {
      resualt: "ok",
    };
    const TEST_DISCOUNT = 100;
    const TEST_DELIVERY = {
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

    getAvailableDeliveriesWrapper.mockResolvedValueOnce([TEST_DELIVERY]);

    findOneDeliveryWrapper.mockResolvedValueOnce(TEST_DELIVERY);

    findOneOrFailPaymentWrapper.mockResolvedValueOnce(TEST_PAYMENT);

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
        street: faker.datatype.string(),
        house: faker.datatype.string(),
        entrance: faker.datatype.number({ max: 99, min: 0 }),
        floor: faker.datatype.number({ max: 99, min: 0 }),
        apartment: faker.datatype.number({ max: 99, min: 0 }),
      },
      payment_uuid: TEST_PAYMENT.uuid,
      client_info: {
        name: faker.datatype.string(),
        phone: faker.datatype.string(),
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

    expect(payload.append).toBeCalledWith("tags[0]", TEST_PAYMENT.code);

    expect(payload.append).toBeCalledWith("home", dto.delivery_address.house);
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
        street: faker.datatype.string(),
        house: faker.datatype.string(),
        entrance: faker.datatype.number({ max: 99, min: 0 }),
        floor: faker.datatype.number({ max: 99, min: 0 }),
        apartment: faker.datatype.number({ max: 99, min: 0 }),
      },
      payment_uuid: TEST_PAYMENT.uuid,
      client_info: {
        name: faker.datatype.string(),
        phone: faker.datatype.string(),
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
        street: faker.datatype.string(),
        house: faker.datatype.string(),
        entrance: faker.datatype.number({ max: 99, min: 0 }),
        floor: faker.datatype.number({ max: 99, min: 0 }),
        apartment: faker.datatype.number({ max: 99, min: 0 }),
      },
      payment_uuid: TEST_PAYMENT.uuid,
      client_info: {
        name: faker.datatype.string(),
        phone: faker.datatype.string(),
      },
    };

    expect(orderService.makeAnOrder(dto)).rejects.toThrow(
      `The modifier ${TEST_FAKE_MODIFIER_UUID} does not found`
    );
  });

  it("should throw an error when the delivery was not provided, but the available deliveries exits", async () => {
    const TEST_FAKE_DELIVERY_UUID = faker.datatype.uuid();
    const orderedProducts = (5).map(() =>
      productsFactory.create({
        category_uuid: faker.datatype.uuid(),
      })
    );
    const TEST_PAYMENT = {
      ...paymentFactory.create(),
      uuid: faker.datatype.uuid(),
    };

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
        street: faker.datatype.string(),
        house: faker.datatype.string(),
        entrance: faker.datatype.number({ max: 99, min: 0 }),
        floor: faker.datatype.number({ max: 99, min: 0 }),
        apartment: faker.datatype.number({ max: 99, min: 0 }),
      },
      payment_uuid: TEST_PAYMENT.uuid,
      client_info: {
        name: faker.datatype.string(),
        phone: faker.datatype.string(),
      },
    };

    expect(orderService.makeAnOrder(dto)).rejects.toThrow(
      `There are available deliveries, but no one delivery was not provided`
    );
  });

  it("should throw an error when the delivery is not available", async () => {
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
        street: faker.datatype.string(),
        house: faker.datatype.string(),
        entrance: faker.datatype.number({ max: 99, min: 0 }),
        floor: faker.datatype.number({ max: 99, min: 0 }),
        apartment: faker.datatype.number({ max: 99, min: 0 }),
      },
      payment_uuid: TEST_PAYMENT.uuid,
      client_info: {
        name: faker.datatype.string(),
        phone: faker.datatype.string(),
      },
    };

    expect(orderService.makeAnOrder(dto)).rejects.toThrow(
      `The delivery ${TEST_NOT_AVAILABLE_DELIVERY.uuid} not available`
    );
  });
});
