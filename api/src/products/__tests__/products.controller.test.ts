import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import ProductsModule from "../products.module";
import ProductsService from "../products.service";
import { getModelToken } from "@nestjs/mongoose";
import { Product } from "~/schemas/product.schema";
import initApp from "~/utils/init-app";
import { CreateProductDto } from "../products.dto";

describe("Project Contoller", () => {
  let app: INestApplication;
  let productsService: Partial<ProductsService> = {
    findAll: jest.fn(() => Promise.resolve([])),
    find: jest.fn(() => Promise.resolve(null)),
    create: jest.fn(() => Promise.resolve(new Product())),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProductsModule],
    })
      .overrideProvider(ProductsService)
      .useValue(productsService)
      .overrideProvider(getModelToken(Product.name))
      .useValue({})
      .compile();

    app = initApp(moduleRef.createNestApplication());
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  test(`/GET products`, async () => {
    const TEST_PRODUCT_LIST: Product[] = [
      {
        uuid: "1",
        name: "test",
        imageURL: "test",
        updated_at: new Date(),
        created_at: new Date(),
      },
    ];

    (productsService.findAll as jest.Mock).mockReturnValueOnce(
      TEST_PRODUCT_LIST
    );

    const response = await request(app.getHttpServer()).get("/products");

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({
      statusCode: 200,
      data: TEST_PRODUCT_LIST.map((p) => ({
        ...p,
        updated_at: p.updated_at.toISOString(),
        created_at: p.created_at.toISOString(),
      })),
    });
    expect(productsService.findAll as jest.Mock).toBeCalledTimes(1);
    expect(productsService.findAll as jest.Mock).toBeCalledWith();
  });

  test(`/GET products/:productUUID`, async () => {
    const TEST_PRODUCT: Product = {
      uuid: "1",
      name: "test",
      imageURL: "test",
      updated_at: new Date(),
      created_at: new Date(),
    };

    (productsService.find as jest.Mock).mockReturnValueOnce(TEST_PRODUCT);

    const response = await request(app.getHttpServer()).get(
      `/products/${TEST_PRODUCT.uuid}`
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({
      statusCode: 200,
      data: {
        ...TEST_PRODUCT,
        updated_at: TEST_PRODUCT.updated_at.toISOString(),
        created_at: TEST_PRODUCT.created_at.toISOString(),
      },
    });
    expect(productsService.find as jest.Mock).toBeCalledTimes(1);
    expect(productsService.find as jest.Mock).toBeCalledWith({
      uuid: TEST_PRODUCT.uuid,
    });
  });

  it(`/GET products/:productUUID - should throw found exception`, async () => {
    const TEST_PRODUCT_UUID = "test-uuid";

    (productsService.find as jest.Mock).mockReturnValueOnce(null);

    const response = await request(app.getHttpServer()).get(
      `/products/${TEST_PRODUCT_UUID}`
    );

    expect(response.statusCode).toEqual(404);
    expect(response.body).toStrictEqual({
      statusCode: 404,
      message: "Not Found",
    });
    expect(productsService.find as jest.Mock).toBeCalledTimes(1);
    expect(productsService.find as jest.Mock).toBeCalledWith({
      uuid: TEST_PRODUCT_UUID,
    });
  });

  it("/POST /poducts", async () => {
    const TEST_PRODUCT: Product = {
      uuid: "1",
      name: "test",
      imageURL: "test",
      updated_at: new Date(),
      created_at: new Date(),
    };

    const TEST_CREATE_PRODUCT_DTO: CreateProductDto = {
      name: "test",
      imageURL: "test",
    };

    (productsService.create as jest.Mock).mockReturnValueOnce(TEST_PRODUCT);

    const response = await request(app.getHttpServer())
      .post("/products")
      .send({
        name: TEST_PRODUCT.name,
        imageURL: TEST_PRODUCT.imageURL,
      } as CreateProductDto);
  });
});
