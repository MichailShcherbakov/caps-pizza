import { Product } from "~/services/products.service";
import { DataTable } from "~/ui";

export interface ProductsTableProps {
  products: Product[];
}

export const ProductsTable: React.FC<ProductsTableProps> = ({ products }) => {
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
            name: "category",
            displayName: "Категория",
            primary: true,
          },
          {
            name: "price",
            displayName: "Цена",
            primary: true,
          },
        ],
      }}
      rows={products.map(product => ({
        cols: [
          {
            name: "name",
            value: product.name,
          },
          {
            name: "category",
            value: product.category?.name,
          },
          {
            name: "price",
            value: product.price,
          },
        ],
      }))}
    />
  );
};

export default ProductsTable;
