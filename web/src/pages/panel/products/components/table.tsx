import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { UnknownApiError } from "~/common/components/error-handler/api-errors";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import { useGetProductsQuery } from "~/services/products.service";
import ProductsTableRow from "./table-row";
import ProductsTableSkeleton from "./table.skeleton";

export interface ProductsTableProps {}

export const ProductsTable: React.FC<ProductsTableProps> = () => {
  const {
    data: products = [],
    error,
    isLoading,
    isError,
  } = useGetProductsQuery();
  const { data: modifierCategories = [] } = useGetModifierCategoriesQuery();

  return isLoading || isError ? (
    <>
      <ProductsTableSkeleton />
      {error ? <UnknownApiError /> : undefined}
    </>
  ) : (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>UUID</TableCell>
          <TableCell align="right">Изображение</TableCell>
          <TableCell align="right">Название</TableCell>
          <TableCell align="right">Описание</TableCell>
          <TableCell align="right">Артикул</TableCell>
          <TableCell align="right">Цена</TableCell>
          <TableCell align="right">Категория</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map(product => (
          <ProductsTableRow
            key={product.uuid}
            product={product}
            modifierCategories={modifierCategories}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductsTable;
