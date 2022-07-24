import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import ProductsModule from "../products.module";
import ProductsService from "../products.service";
import { getModelToken } from "@nestjs/mongoose";
import { Product } from "~/schemas/product.schema";
import initApp from "~/utils/init-app";
import { CreateProductDto } from "../products.dto";
import { Category } from "~/schemas/category.schema";
import CategoriesService from "~/modules/categories/categories.service";

describe("Project Contoller", () => {
  let app: INestApplication;
  const productsService: Partial<ProductsService> = {
    find: jest.fn(() => Promise.resolve([])),
    findOne: jest.fn(() => Promise.resolve(null)),
    create: jest.fn(() => Promise.resolve(new Product())),
  };
  const categoriesService: Partial<CategoriesService> = {
    find: jest.fn(() => Promise.resolve([])),
    findOne: jest.fn(() => Promise.resolve(null)),
    create: jest.fn(() => Promise.resolve(new Category())),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProductsModule],
    })
      .overrideProvider(ProductsService)
      .useValue(productsService)
      .overrideProvider(CategoriesService)
      .useValue(categoriesService)
      .overrideProvider(getModelToken(Product.name))
      .useValue({})
      .overrideProvider(getModelToken(Category.name))
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
        _id: "1",
        article_number: 1,
        name: "test",
        imageURL: "test",
        category: {} as Category,
        updated_at: new Date(),
        created_at: new Date(),
      },
    ];

    (productsService.find as jest.Mock).mockResolvedValueOnce(
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
    expect(productsService.find as jest.Mock).toBeCalledTimes(1);
    expect(productsService.find as jest.Mock).toBeCalledWith();
  });

  test(`/GET products/:productUUID`, async () => {
    const TEST_PRODUCT: Product = {
      _id: "1",
      article_number: 1,
      name: "test",
      imageURL: "test",
      category: {} as Category,
      updated_at: new Date(),
      created_at: new Date(),
    };

    (productsService.findOne as jest.Mock).mockResolvedValueOnce(TEST_PRODUCT);

    const response = await request(app.getHttpServer()).get(
      `/products/${TEST_PRODUCT._id}`
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
    expect(productsService.findOne as jest.Mock).toBeCalledTimes(1);
    expect(productsService.findOne as jest.Mock).toBeCalledWith({
      id: TEST_PRODUCT._id,
    });
  });

  it(`/GET products/:productUUID - should throw found exception`, async () => {
    const TEST_PRODUCT_UUID = "test_id";

    (productsService.findOne as jest.Mock).mockReturnValueOnce(null);

    const response = await request(app.getHttpServer()).get(
      `/products/${TEST_PRODUCT_UUID}`
    );

    expect(response.statusCode).toEqual(404);
    expect(response.body).toStrictEqual({
      error: "Not Found",
      statusCode: 404,
      message: "The product test_id does not exist",
    });
    expect(productsService.findOne as jest.Mock).toBeCalledTimes(1);
    expect(productsService.findOne as jest.Mock).toBeCalledWith({
      id: TEST_PRODUCT_UUID,
    });
  });

  it("/POST /poducts", async () => {
    const TEST_CATEGORY = {
      _id: "1",
      name: "test-category",
      imageURL: "test-category-image-url",
      updated_at: new Date(),
      created_at: new Date(),
    };

    const TEST_PRODUCT: Product = {
      _id: "1",
      article_number: 1,
      name: "test",
      imageURL: "test",
      category: TEST_CATEGORY,
      updated_at: new Date(),
      created_at: new Date(),
    };

    const TEST_CREATE_PRODUCT_DTO: CreateProductDto = {
      article_number: 1,
      name: "test",
      imageURL: "test",
      category_id: "1",
    };

    (productsService.create as jest.Mock).mockReturnValueOnce(TEST_PRODUCT);
    (categoriesService.findOne as jest.Mock).mockReturnValueOnce(TEST_CATEGORY);

    const response = await request(app.getHttpServer())
      .post("/products")
      .send(TEST_CREATE_PRODUCT_DTO);

    expect(response.status).toEqual(201);
    expect(response.body).toStrictEqual({
      statusCode: 201,
      data: {
        ...TEST_PRODUCT,
        category: {
          ...TEST_PRODUCT.category,
          updated_at: TEST_PRODUCT.category.updated_at.toISOString(),
          created_at: TEST_PRODUCT.category.created_at.toISOString(),
        },
        updated_at: TEST_PRODUCT.updated_at.toISOString(),
        created_at: TEST_PRODUCT.created_at.toISOString(),
      },
    });
  });
});
