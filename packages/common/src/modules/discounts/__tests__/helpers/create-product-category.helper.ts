import { faker } from "@faker-js/faker";
import { IProductCategory } from "../../../../interfaces";

export const createProductCategory = (
  options: Partial<IProductCategory> = {}
): IProductCategory => {
  return {
    uuid: faker.datatype.uuid(),
    name: faker.datatype.uuid(),
    image_url: faker.image.imageUrl(),
    display: true,
    display_position: faker.datatype.number(),
    ...options,
  };
};

export default IProductCategory;
