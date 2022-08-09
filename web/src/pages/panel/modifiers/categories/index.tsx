import { Paper, Stack } from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";
import AppPage from "~/common/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateModifierCategoryModal from "./components/modals/create-modifier-category.modal";
import ModifierCategoriesTableSkeleton from "./components/table.skeleton";

export const ModifierCategoriesTable = dynamic(
  () => import("./components/table"),
  {
    suspense: true,
    ssr: false,
  }
);

export const ModifierCategoriesPage: AppPage = () => {
  return (
    <Paper>
      <React.Suspense fallback={<ModifierCategoriesTableSkeleton />}>
        <ModifierCategoriesTable />
      </React.Suspense>
      <Stack direction="row" alignItems="center" className="ui-p-8">
        <CreateModifierCategoryModal />
      </Stack>
    </Paper>
  );
};

ModifierCategoriesPage.getLayout = page => {
  return <AdminPanelLayout>{page}</AdminPanelLayout>;
};

export default ModifierCategoriesPage;
