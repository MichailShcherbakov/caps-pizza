import PromotionEntity from "~/db/entities/promotion.entity";
import PromotionSeeder from "~/db/seeders/promotion.seeder";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/__tests__/helpers/delete-object-props.helper";
import { ITestingModule } from "~/utils/__tests__/interfaces/testing-module.interface";

export default function createPromotionsHelper(
  testingModule: ITestingModule
): Promise<PromotionEntity[]> {
  const seeder = new PromotionSeeder(testingModule.queryRunner);
  return seeder
    .createMany(10)
    .then(
      promotions =>
        deleteObjectsPropsHelper(promotions, [
          "updated_at",
          "created_at",
        ]) as PromotionEntity[]
    );
}

export function createPromotionHelper(
  testingModule: ITestingModule
): Promise<PromotionEntity> {
  const seeder = new PromotionSeeder(testingModule.queryRunner);
  return seeder
    .create()
    .then(
      promotion =>
        deleteObjectPropsHelper(promotion, [
          "updated_at",
          "created_at",
        ]) as PromotionEntity
    );
}
