import ProductCategoryEntity from "~/db/entities/product-category.entity";

export const TEST_PRODUCT_CATEGORIES: ProductCategoryEntity[] = [
  {
    uuid: "0",
    name: "Pizza",
    image_url: "",
    updated_at: new Date(),
    created_at: new Date(),
  },
  {
    uuid: "1",
    name: "Roll",
    image_url: "",
    updated_at: new Date(),
    created_at: new Date(),
  },
];

export default TEST_PRODUCT_CATEGORIES;
