import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useGetDiscountsQuery } from "~/services/discounts.service";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";
import DiscountsTableRow from "./table-row";
import DiscountsTableSkeleton from "./table.skeleton";

export interface DiscountsTableProps {}

export const DiscountsTable: React.FC<DiscountsTableProps> = () => {
  const { data: discounts = [], isLoading, isError } = useGetDiscountsQuery();
  const { data: modifierCategories = [] } = useGetModifierCategoriesQuery();
  const { data: productCategories = [] } = useGetProductCategoriesQuery();

  return isLoading || isError ? (
    <>
      <DiscountsTableSkeleton />
    </>
  ) : (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>UUID</TableCell>
          <TableCell align="right">Название</TableCell>
          <TableCell align="right">Тип</TableCell>
          <TableCell align="right">Область действия</TableCell>
          <TableCell align="right">Условие</TableCell>
          <TableCell align="right">Значение</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {discounts.map(discount => (
          <DiscountsTableRow
            key={discount.uuid}
            discount={discount}
            productCategories={productCategories}
            modifierCategories={modifierCategories}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default DiscountsTable;
