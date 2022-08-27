import { DataSource } from "typeorm";
import DiscountStrategyEntity from "~/db/entities/discount-strategy.entity";
import DiscountEntity from "~/db/entities/discount.entity";
import DiscountStrategiesSeeder from "~/db/seeds/discount-strategy.seed";
import DiscountsSeeder from "~/db/seeds/discount.seed";

export async function createDiscountStrategyHelper(
  dataSource: DataSource,
  options?: Partial<DiscountStrategyEntity>
): Promise<DiscountStrategyEntity> {
  const discountStrategiesSeeder = new DiscountStrategiesSeeder(dataSource);
  return discountStrategiesSeeder.seed(options);
}

export async function createDiscountHelper(
  dataSource: DataSource,
  options?: Partial<DiscountEntity>
): Promise<DiscountEntity> {
  const discountsSeeder = new DiscountsSeeder(dataSource);
  return discountsSeeder.seed(options);
}

export default async function createDiscountsHelper(
  dataSource: DataSource
): Promise<DiscountEntity[]> {
  const discountsSeeder = new DiscountsSeeder(dataSource);
  const strategiesSeeder = new DiscountStrategiesSeeder(dataSource);

  const discounts = await discountsSeeder.run(10);

  for (const discount of discounts) {
    discount.strategies.push(
      await strategiesSeeder.seed({
        discount_uuid: discount.uuid,
      })
    );
  }

  return discounts;
}
