import { Modifier } from "~/services/modifiers.service";
import { ProductCategory } from "~/services/product-categories.service";

export const formatProductFeatures = (
  productCategories: ProductCategory[],
  modifiers: Modifier[]
) => {
  return [
    ...productCategories.map(c => ({ ...c, _type: `Категория` })),
    ...modifiers.map(m => ({
      ...m,
      _type: `Модификатор: ${m.category?.name ?? "Неизвестно"} `,
    })),
  ];
};

export default formatProductFeatures;
