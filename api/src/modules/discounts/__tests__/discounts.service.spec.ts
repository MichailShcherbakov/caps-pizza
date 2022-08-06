import { Repository } from "typeorm/repository/Repository";
import DiscountEntity, {
  DiscountTypeEnum,
} from "~/db/entities/discount.entity";
import ModifiersService from "~/modules/modifiers/modifiers.service";
import { Order, OrderedProduct } from "~/modules/orders/orders.dto";
import ProductCategoriesService from "~/modules/products/modules/categories/categories.service";
import ProductsService from "~/modules/products/products.service";
import DiscountsService from "../discounts.service";
import TEST_DISCOUNTS from "./data/discounts.data";
import TEST_MODIFIERS from "./data/modifiers.data";
import TEST_PRODUCTS from "./data/products.data";
import computeFinalOrderCostHelper from "./helpers/compute-final-order-cost.helper";

describe("[Unit] [Discounts Module] ...", () => {
  let discountsService: DiscountsService;
  let discountRepository: Repository<DiscountEntity>;
  let productCategoriesService: ProductCategoriesService;
  const productsService: ProductsService = {
    find: jest.fn(),
  } as any;
  const modifiersService: ModifiersService = {
    find: jest.fn(),
  } as any;

  beforeAll(async () => {
    discountsService = new DiscountsService(
      discountRepository,
      productsService,
      productCategoriesService,
      modifiersService
    );

    discountsService.find = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should not provide any discounts for only one product", async () => {
    (productsService.find as jest.Mock).mockResolvedValueOnce([
      TEST_PRODUCTS[0],
    ]);
    (discountsService.find as jest.Mock).mockResolvedValueOnce(TEST_DISCOUNTS);
    (modifiersService.find as jest.Mock).mockResolvedValueOnce(TEST_MODIFIERS);

    const orderedProducts: OrderedProduct[] = [
      {
        uuid: TEST_PRODUCTS[0].uuid,
        count: 1,
        modifiers: [TEST_MODIFIERS[0]],
      },
    ];

    const discount = await discountsService.calculate({
      products: orderedProducts,
    } as Order);

    expect(discount).toBeNull();
  });

  it("3x450 = {fixed discount price}", async () => {
    (productsService.find as jest.Mock).mockResolvedValueOnce([
      TEST_PRODUCTS[0],
    ]);
    (discountsService.find as jest.Mock).mockResolvedValueOnce(TEST_DISCOUNTS);
    (modifiersService.find as jest.Mock).mockResolvedValueOnce(TEST_MODIFIERS);

    const orderedProducts: OrderedProduct[] = [
      {
        uuid: TEST_PRODUCTS[0].uuid,
        count: 3,
        modifiers: [TEST_MODIFIERS[0]],
      },
    ];

    const finalCostOrder = computeFinalOrderCostHelper(
      [TEST_PRODUCTS[0]],
      [3],
      [[TEST_MODIFIERS[0]]]
    );

    const discount = await discountsService.calculate({
      products: orderedProducts,
    } as Order);

    expect(discount).not.toBeNull();
    expect(discount?.type).toEqual(DiscountTypeEnum.IN_CASH);
    expect(discount?.value).toEqual(finalCostOrder - TEST_DISCOUNTS[1].value);
  });

  it("4x450 = {fixed discount price} + 1x450", async () => {
    (productsService.find as jest.Mock).mockResolvedValueOnce([
      TEST_PRODUCTS[0],
    ]);
    (discountsService.find as jest.Mock).mockResolvedValueOnce(TEST_DISCOUNTS);
    (modifiersService.find as jest.Mock).mockResolvedValueOnce(TEST_MODIFIERS);

    const orderedProducts: OrderedProduct[] = [
      {
        uuid: TEST_PRODUCTS[0].uuid,
        count: 4,
        modifiers: [TEST_MODIFIERS[0]],
      },
    ];

    const finalCostOrder = computeFinalOrderCostHelper(
      [TEST_PRODUCTS[0]],
      [4],
      [[TEST_MODIFIERS[0]]]
    );

    const discount = await discountsService.calculate({
      products: orderedProducts,
    } as Order);

    expect(discount).not.toBeNull();
    expect(discount?.type).toEqual(DiscountTypeEnum.IN_CASH);
    expect(discount?.value).toEqual(
      finalCostOrder -
        (TEST_DISCOUNTS[1].value +
          TEST_PRODUCTS[0].price +
          TEST_MODIFIERS[0].price)
    );
  });

  it("2x450 + 2x520 = {fixed discount price} + 1x520", async () => {
    (productsService.find as jest.Mock).mockResolvedValueOnce([
      TEST_PRODUCTS[0],
      TEST_PRODUCTS[1],
    ]);
    (discountsService.find as jest.Mock).mockResolvedValueOnce(TEST_DISCOUNTS);
    (modifiersService.find as jest.Mock).mockResolvedValueOnce(TEST_MODIFIERS);

    const orderedProducts: OrderedProduct[] = [
      {
        uuid: TEST_PRODUCTS[0].uuid,
        count: 2,
        modifiers: [TEST_MODIFIERS[0]],
      },
      {
        uuid: TEST_PRODUCTS[1].uuid,
        count: 2,
        modifiers: [TEST_MODIFIERS[0]],
      },
    ];

    const finalCostOrder = computeFinalOrderCostHelper(
      [TEST_PRODUCTS[0], TEST_PRODUCTS[1]],
      [2, 2],
      [[TEST_MODIFIERS[0]], [TEST_MODIFIERS[0]]]
    );

    const discount = await discountsService.calculate({
      products: orderedProducts,
    } as Order);

    expect(discount).not.toBeNull();
    expect(discount?.type).toEqual(DiscountTypeEnum.IN_CASH);
    expect(discount?.value).toEqual(
      finalCostOrder -
        (TEST_DISCOUNTS[1].value +
          TEST_PRODUCTS[1].price +
          TEST_MODIFIERS[0].price)
    );
  });

  it("3x450 + 3x520 = {fixed discount price}x2", async () => {
    (productsService.find as jest.Mock).mockResolvedValueOnce([
      TEST_PRODUCTS[0],
      TEST_PRODUCTS[1],
    ]);
    (discountsService.find as jest.Mock).mockResolvedValueOnce(TEST_DISCOUNTS);
    (modifiersService.find as jest.Mock).mockResolvedValueOnce(TEST_MODIFIERS);

    const orderedProducts: OrderedProduct[] = [
      {
        uuid: TEST_PRODUCTS[0].uuid,
        count: 3,
        modifiers: [TEST_MODIFIERS[0]],
      },
      {
        uuid: TEST_PRODUCTS[1].uuid,
        count: 3,
        modifiers: [TEST_MODIFIERS[0]],
      },
    ];

    const finalCostOrder = computeFinalOrderCostHelper(
      [TEST_PRODUCTS[0], TEST_PRODUCTS[1]],
      [3, 3],
      [[TEST_MODIFIERS[0]], [TEST_MODIFIERS[0]]]
    );

    const discount = await discountsService.calculate({
      products: orderedProducts,
    } as Order);

    expect(discount).not.toBeNull();
    expect(discount?.type).toEqual(DiscountTypeEnum.IN_CASH);
    expect(discount?.value).toEqual(
      finalCostOrder - TEST_DISCOUNTS[1].value * 2
    );
  });

  it("3x450 + 4x520 = {fixed discount price}x2 + 1x520", async () => {
    (productsService.find as jest.Mock).mockResolvedValueOnce([
      TEST_PRODUCTS[0],
      TEST_PRODUCTS[1],
    ]);
    (discountsService.find as jest.Mock).mockResolvedValueOnce(TEST_DISCOUNTS);
    (modifiersService.find as jest.Mock).mockResolvedValueOnce(TEST_MODIFIERS);

    const orderedProducts: OrderedProduct[] = [
      {
        uuid: TEST_PRODUCTS[0].uuid,
        count: 3,
        modifiers: [TEST_MODIFIERS[0]],
      },
      {
        uuid: TEST_PRODUCTS[1].uuid,
        count: 4,
        modifiers: [TEST_MODIFIERS[0]],
      },
    ];

    const finalCostOrder = computeFinalOrderCostHelper(
      [TEST_PRODUCTS[0], TEST_PRODUCTS[1]],
      [3, 4],
      [[TEST_MODIFIERS[0]], [TEST_MODIFIERS[0]]]
    );

    const discount = await discountsService.calculate({
      products: orderedProducts,
    } as Order);

    expect(discount).not.toBeNull();
    expect(discount?.type).toEqual(DiscountTypeEnum.IN_CASH);
    expect(discount?.value).toEqual(
      finalCostOrder -
        (TEST_DISCOUNTS[1].value * 2 +
          TEST_PRODUCTS[1].price +
          TEST_MODIFIERS[0].price)
    );
  });

  it("3x450 + 4x520 + {not}{2x220} = {fixed discount price}x2 + 1x520", async () => {
    (productsService.find as jest.Mock).mockResolvedValueOnce([
      TEST_PRODUCTS[0],
      TEST_PRODUCTS[1],
      TEST_PRODUCTS[3],
    ]);
    (discountsService.find as jest.Mock).mockResolvedValueOnce(TEST_DISCOUNTS);
    (modifiersService.find as jest.Mock).mockResolvedValueOnce(TEST_MODIFIERS);

    const orderedProducts: OrderedProduct[] = [
      {
        uuid: TEST_PRODUCTS[0].uuid,
        count: 3,
        modifiers: [TEST_MODIFIERS[0]],
      },
      {
        uuid: TEST_PRODUCTS[1].uuid,
        count: 4,
        modifiers: [TEST_MODIFIERS[0]],
      },
      {
        uuid: TEST_PRODUCTS[3].uuid,
        count: 2,
        modifiers: [],
      },
    ];

    const finalCostOrder = computeFinalOrderCostHelper(
      [TEST_PRODUCTS[0], TEST_PRODUCTS[1], TEST_PRODUCTS[3]],
      [3, 4, 2],
      [[TEST_MODIFIERS[0]], [TEST_MODIFIERS[0]], []]
    );

    const discount = await discountsService.calculate({
      products: orderedProducts,
    } as Order);

    expect(discount).not.toBeNull();
    expect(discount?.type).toEqual(DiscountTypeEnum.IN_CASH);
    expect(discount?.value).toEqual(
      finalCostOrder -
        (TEST_DISCOUNTS[1].value * 2 +
          TEST_PRODUCTS[1].price +
          TEST_MODIFIERS[0].price +
          TEST_PRODUCTS[3].price * 2)
    );
  });
});
