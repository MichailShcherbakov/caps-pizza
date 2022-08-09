import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/router";
import OhNoTryAgainNotificationModal from "~/common/components/notifications/modals/oh-no-try-again.notification";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import ModifierCategoriesTableRow from "./table-row";
import ModifierCategoriesTableSkeleton from "./table.skeleton";

export interface ModifierCategoriesTableProps {}

export const ModifierCategoriesTable: React.FC<
  ModifierCategoriesTableProps
> = () => {
  const {
    data: modifierCategories = [],
    error,
    isError,
    isLoading,
  } = useGetModifierCategoriesQuery();
  const router = useRouter();

  return isLoading || isError ? (
    <>
      <ModifierCategoriesTableSkeleton />
      {error && (
        <OhNoTryAgainNotificationModal onAccept={() => router.reload()} />
      )}
    </>
  ) : (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>UUID</TableCell>
          <TableCell align="right">Название</TableCell>
          <TableCell align="right">Позиция</TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {modifierCategories.map(c => (
          <ModifierCategoriesTableRow key={c.uuid} category={c} />
        ))}
      </TableBody>
    </Table>
  );
};

export default ModifierCategoriesTable;
