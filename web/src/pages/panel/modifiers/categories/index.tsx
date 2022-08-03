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
import React from "react";
import AppPage from "~/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import {
  useDeleteModifierCategoryMutation,
  useGetModifierCategoriesQuery,
} from "~/services/api";
import CreateModifierCategoryModal from "./components/modal";

export const ModifierCategoriesPage: AppPage = () => {
  const { data: modifierCatoriesOrError, isLoading } =
    useGetModifierCategoriesQuery();
  const [deleteModifierCategory] = useDeleteModifierCategoryMutation();

  if (isLoading || !modifierCatoriesOrError) return null;

  if (!Array.isArray(modifierCatoriesOrError)) return null;

  const modifierCatories = modifierCatoriesOrError;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>UUID</TableCell>
            <TableCell>Название</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {modifierCatories.map(c => (
            <TableRow key={c.uuid}>
              <TableCell>{c.uuid}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => deleteModifierCategory({ uuid: c.uuid })}
                >
                  Удалить
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <CreateModifierCategoryModal />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ModifierCategoriesPage.getLayout = page => {
  return <AdminPanelLayout>{page}</AdminPanelLayout>;
};

export default ModifierCategoriesPage;
