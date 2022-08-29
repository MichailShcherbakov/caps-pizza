import React from "react";
import { ProductCategory } from "~/services/product-categories.service";
import { DataTable } from "~/ui";

export interface ProductCategoryTableProps {
  categories: ProductCategory[];
  checkedProductCategoriesUuids?: Set<string>;
  onProductCategoryCheckedChange?: (category: ProductCategory) => void;
}

export const ProductCategoryTable: React.FC<ProductCategoryTableProps> =
  React.memo(
    ({
      categories,
      checkedProductCategoriesUuids = new Set<string>(),
      onProductCategoryCheckedChange,
    }) => {
      return (
        <DataTable
          collapsible={false}
          head={{
            cols: [
              {
                type: "checkbox",
                name: "checked",
                displayName: "",
                primary: true,
              },
              {
                name: "name",
                displayName: "Название",
                primary: true,
              },
            ],
          }}
          rows={categories.map(category => ({
            cols: [
              {
                name: "checked",
                value: checkedProductCategoriesUuids.has(category.uuid),
                onChange: () =>
                  onProductCategoryCheckedChange &&
                  onProductCategoryCheckedChange(category),
              },
              {
                name: "name",
                value: category.name,
              },
            ],
          }))}
        />
      );
    }
  );

ProductCategoryTable.displayName = "ProductCategoryTable";

export default ProductCategoryTable;
