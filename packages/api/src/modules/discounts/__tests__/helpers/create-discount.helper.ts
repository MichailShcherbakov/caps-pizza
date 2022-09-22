import { faker } from "@faker-js/faker";
import DiscountEntity from "~/db/entities/discount.entity";

export default function createDiscountHelper(
  options: Omit<DiscountEntity, "uuid" | "name" | "updated_at" | "created_at">
): DiscountEntity {
  return {
    ...options,
    uuid: faker.datatype.uuid(),
    name: faker.datatype.uuid(),
    updated_at: new Date(),
    created_at: new Date(),
  };
}
