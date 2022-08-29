import React from "react";
import { Product } from "~/services/products.service";
import { DataTable } from "~/ui";

export interface ProductTableProps {
  products: Product[];
  checkedProductsUuids?: Set<string>;
  onProductCheckedChange?: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = React.memo(
  ({
    products,
    checkedProductsUuids = new Set<string>(),
    onProductCheckedChange,
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
            {
              name: "categoryName",
              displayName: "Категория",
              primary: true,
            },
          ],
        }}
        rows={products.map(product => ({
          cols: [
            {
              name: "checked",
              value: checkedProductsUuids.has(product.uuid),
              onChange: () =>
                onProductCheckedChange && onProductCheckedChange(product),
            },
            {
              name: "name",
              value: product.name,
            },
            {
              name: "categoryName",
              value: product.category?.name ?? "Нет",
            },
          ],
        }))}
      />
    );
  }
);

ProductTable.displayName = "ProductTable";

export default ProductTable;
