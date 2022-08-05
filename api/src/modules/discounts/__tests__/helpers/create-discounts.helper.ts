import { DataSource } from "typeorm";
import DiscountEntity from "~/db/entities/discount.entity";
import DiscountsSeeder from "~/db/seeds/discount.seed";

export function createDiscountHelper(
  dataSource: DataSource,
  options?: Partial<DiscountEntity>
): Promise<DiscountEntity> {
  const seeder = new DiscountsSeeder(dataSource);
  return seeder.seed(options);
}

export default function createDiscountsHelper(
  dataSource: DataSource,
  options?: Partial<DiscountEntity>
): Promise<DiscountEntity[]> {
  const seeder = new DiscountsSeeder(dataSource);
  return seeder.run(10, options);
}
