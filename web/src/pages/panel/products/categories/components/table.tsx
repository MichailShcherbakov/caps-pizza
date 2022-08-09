import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";
import ProductCategoriesTableRow from "./table-row";
import ProductCategoriesTableSkeleton from "./table.skeleton";

export interface ProductCategoriesTableProps {}

export const ProductCategoriesTable: React.FC<
  ProductCategoriesTableProps
> = () => {
  const {
    data: productCategories = [],
    isLoading,
    isError,
  } = useGetProductCategoriesQuery();

  return isLoading || isError ? (
    <>
      <ProductCategoriesTableSkeleton />
    </>
  ) : (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>UUID</TableCell>
          <TableCell align="right">Изображение</TableCell>
          <TableCell align="right">Название</TableCell>
          <TableCell align="right">Позиция</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {productCategories.map(category => (
          <ProductCategoriesTableRow key={category.uuid} category={category} />
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductCategoriesTable;
