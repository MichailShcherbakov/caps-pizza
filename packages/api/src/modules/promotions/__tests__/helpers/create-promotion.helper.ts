import PromotionEntity from "~/db/entities/promotion.entity";
import PromotionSeeder from "~/db/seeders/promotion.seeder";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/delete-object-props.helper";
import { ITestingModule } from "~/utils/testing-module.interface";

export default function createPromotionsHelper(
  testingModule: ITestingModule
): Promise<PromotionEntity[]> {
  const seeder = new PromotionSeeder(testingModule.queryRunner);
  return seeder
    .run(10)
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
    .seed({})
    .then(
      promotion =>
        deleteObjectPropsHelper(promotion, [
          "updated_at",
          "created_at",
        ]) as PromotionEntity
    );
}
