import { faker } from "@faker-js/faker";
import { DataSource } from "typeorm";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import ModifierEntity from "../entities/modifier.entity";

export class ModifiersFactory extends IFactory<ModifierEntity> {
  create(options: Partial<ModifierEntity> = {}): ModifierEntity {
    const newModifier = new ModifierEntity();
    newModifier.name = options.name || faker.commerce.productName();
    newModifier.desc = options.desc;
    newModifier.image_url = options.image_url;
    newModifier.article_number =
      options.article_number || faker.datatype.number();
    newModifier.price = options.price || faker.datatype.number();
    newModifier.category_uuid = options.category_uuid || faker.datatype.uuid();
    return newModifier;
  }
}

export default class ModifiersSeeder extends ISeeder<ModifierEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, new ModifiersFactory());
  }
}
