import { DataTable } from "~/ui";
import useProductCategoriesTableHead from "../helpers/data-table-head";

export interface ProductCategoriesTableSkeletonProps {}

export const ProductCategoriesTableSkeleton: React.FC<
  ProductCategoriesTableSkeletonProps
> = () => {
  const head = useProductCategoriesTableHead();

  return <DataTable head={head} loading />;
};

export default ProductCategoriesTableSkeleton;
