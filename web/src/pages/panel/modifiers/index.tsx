import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AppPage from "~/common/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import {
  useDeleteModifierMutation,
  useGetModifiersQuery,
} from "~/services/modifiers.service";
import CreateModifierModal from "./components/modal";

export const ModifiersPage: AppPage = () => {
  const { data: modifiers, isLoading, isError } = useGetModifiersQuery();
  const [deleteModifier] = useDeleteModifierMutation();

  if (isLoading || isError) return null;

  return (
    <TableContainer component={Paper}>
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
          {modifiers.map(c => (
            <TableRow key={c.uuid}>
              <TableCell>{c.uuid}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.desc}</TableCell>
              <TableCell>{c.article_number}</TableCell>
              <TableCell>{c.price}</TableCell>
              <TableCell>{c.category?.name}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => deleteModifier({ uuid: c.uuid })}
                >
                  Удалить
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <CreateModifierModal />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ModifiersPage.getLayout = page => {
  return <AdminPanelLayout>{page}</AdminPanelLayout>;
};

export default ModifiersPage;
