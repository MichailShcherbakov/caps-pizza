import DiscountStrategyEntity from "~/db/entities/discount-strategy.entity";
import DiscountEntity from "~/db/entities/discount.entity";
import DiscountStrategiesSeeder from "~/db/seeders/discount-strategy.seeder";
import DiscountsSeeder from "~/db/seeders/discount.seeder";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/__tests__/helpers/delete-object-props.helper";
import { ITestingModule } from "~/utils/__tests__/interfaces/testing-module.interface";

export async function createDiscountStrategyHelper(
  testingModule: ITestingModule,
  options: Partial<DiscountStrategyEntity> = {}
): Promise<DiscountStrategyEntity> {
  const discountStrategiesSeeder = new DiscountStrategiesSeeder(
    testingModule.queryRunner
  );
  return discountStrategiesSeeder.create(options);
}

export async function createDiscountHelper(
  testingModule: ITestingModule,
  options: Partial<DiscountEntity> = {}
): Promise<DiscountEntity> {
  const discountsSeeder = new DiscountsSeeder(testingModule.queryRunner);
  return discountsSeeder.create(options);
}

export default async function createDiscountsHelper(
  testingModule: ITestingModule
): Promise<DiscountEntity[]> {
  const discountsSeeder = new DiscountsSeeder(testingModule.queryRunner);
  const strategiesSeeder = new DiscountStrategiesSeeder(
    testingModule.queryRunner
  );
  const discounts = deleteObjectsPropsHelper<
    "updated_at" | "created_at",
    DiscountEntity
  >(await discountsSeeder.createMany(10), ["updated_at", "created_at"]);

  for (const discount of discounts) {
    discount.strategies.push(
      deleteObjectPropsHelper(
        await strategiesSeeder.create({
          discount_uuid: discount.uuid,
        }),
        ["updated_at", "created_at"]
      ) as DiscountStrategyEntity
    );
  }

  return discounts as DiscountEntity[];
}
