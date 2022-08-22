import { faker } from "@faker-js/faker";
import { IOrderedProduct } from "modules/discounts/get-suitable-discount";
import {
  ProductVolumeTypeEnum,
  ProductWeightTypeEnum,
} from "../../../../interfaces";

export const createProduct = (
  options: Partial<IOrderedProduct> = {}
): IOrderedProduct => {
  return {
    uuid: faker.datatype.uuid(),
    name: faker.datatype.string(),
    desc: faker.datatype.string(),
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
    category_uuid: faker.datatype.uuid(),
    count: 1,
    fullPrice: faker.datatype.number(),
    modifiers: [],
    ...options,
  };
};

export default createProduct;
