import { DataSource } from "typeorm";
import PromotionEntity from "~/db/entities/promotion.entity";
import PromotionSeeder from "~/db/seeds/promotion.seed";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/delete-object-props.helper";

export default function createPromotionsHelper(
  dataSource: DataSource
): Promise<PromotionEntity[]> {
  const seeder = new PromotionSeeder(dataSource);
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
  dataSource: DataSource
): Promise<PromotionEntity> {
  const seeder = new PromotionSeeder(dataSource);
  return seeder
    .seed()
    .then(
      promotion =>
        deleteObjectPropsHelper(promotion, [
          "updated_at",
          "created_at",
        ]) as PromotionEntity
    );
}
