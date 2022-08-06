import ModifierEntity from "~/db/entities/modifier.entity";
import TEST_MODIFIER_CATEGORIES from "./modifier-categories.data";

export const TEST_MODIFIERS: ModifierEntity[] = [
  {
    uuid: "0",
    name: "Tiny Dough",
    article_number: 20001,
    price: 10,
    image_url: "",
    category_uuid: TEST_MODIFIER_CATEGORIES[0].uuid,
    category: TEST_MODIFIER_CATEGORIES[0],
    updated_at: new Date(),
    created_at: new Date(),
  },
];

export default TEST_MODIFIERS;
