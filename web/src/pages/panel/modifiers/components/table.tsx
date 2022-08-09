import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useGetModifiersQuery } from "~/services/modifiers.service";
import ModifiersTableRow from "./table-row";
import ModifiersTableSkeleton from "./table.skeleton";

export interface ModifiersTableProps {}

export const ModifiersTable: React.FC<ModifiersTableProps> = () => {
  const { data: modifiers, isLoading, isError } = useGetModifiersQuery();

  return isLoading || isError ? (
    <>
      <ModifiersTableSkeleton />
    </>
  ) : (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>UUID</TableCell>
          <TableCell>Название</TableCell>
          <TableCell>Описание</TableCell>
          <TableCell>Артикул</TableCell>
          <TableCell>Цена</TableCell>
          <TableCell>Категория</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {modifiers.map(modifier => (
          <ModifiersTableRow key={modifier.uuid} modifier={modifier} />
        ))}
      </TableBody>
    </Table>
  );
};

export default ModifiersTable;
