import { faker } from "@faker-js/faker";
import {
  IProduct,
  ProductVolumeTypeEnum,
  ProductWeightTypeEnum,
} from "../../../../interfaces";

export const createProduct = (options: Partial<IProduct> = {}): IProduct => {
  return {
    uuid: faker.datatype.uuid(),
    name: faker.datatype.uuid(),
    desc: faker.datatype.uuid(),
    article_number: faker.datatype.number(),
    image_url: faker.image.imageUrl(),
    price: faker.datatype.number(),
    weight: {
      type: ProductWeightTypeEnum.GRAMS,
      value: faker.datatype.number(),
    },
    volume: {
      type: ProductVolumeTypeEnum.QUANTITY,
      value: faker.datatype.number(),
    },
    tags: ["test product"],
    categories: [],
    modifiers: [],
    ...options,
  };
};

export const createProducts = (count = 5): IProduct[] => {
  const products: IProduct[] = [];

  for (let i = 0; i < count; ++i) {
    products.push(createProduct());
  }

  return products;
};

export default createProduct;
