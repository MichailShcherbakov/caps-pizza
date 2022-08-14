import { DataTable } from "~/ui";
import useDataTableHead from "../helpers/data-table-head";

export interface ProductsTableProps {}

export const ProductsTableSkeleton: React.FC<ProductsTableProps> = () => {
  const head = useDataTableHead();

  return <DataTable head={head} loading />;
};

export default ProductsTableSkeleton;