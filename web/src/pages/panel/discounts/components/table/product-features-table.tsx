import { Modifier } from "~/services/modifiers.service";
import { ProductCategory } from "~/services/product-categories.service";
import { DataTable } from "~/ui";

export type ProductCategoryType = ProductCategory & {
  _type: "product_category";
};
export type ModifierType = Modifier & { _type: "modifier" };

export type ProductFeature = ProductCategoryType | ModifierType;

export interface ProductFeaturesTableProps {
  features: ProductFeature[];
}

export const ProductFeaturesTable: React.FC<ProductFeaturesTableProps> = ({
  features,
}) => {
  return (
    <DataTable
      collapsible={false}
      head={{
        cols: [
          {
            name: "name",
            displayName: "Название",
            primary: true,
          },
          {
            name: "type",
            displayName: "Тип",
            primary: true,
          },
          {
            name: "price",
            displayName: "Цена",
            primary: true,
          },
        ],
      }}
      rows={features.map(feature => ({
        cols: [
          {
            name: "name",
            value: feature.name,
          },
          {
            name: "type",
            value:
              feature._type === "modifier"
                ? `Модификатор: ${feature.category?.name ?? "Неизвестно"}`
                : "Категория",
          },
          {
            name: "price",
            value: feature._type === "modifier" ? `${feature.price} ₽` : "Нет",
          },
        ],
      }))}
    />
  );
};

export default ProductFeaturesTable;
