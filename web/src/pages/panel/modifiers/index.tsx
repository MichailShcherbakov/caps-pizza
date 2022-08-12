import { Paper, Stack } from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";
import AppPage from "~/common/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateModifierModal from "./components/modals/create-modifier.modal";
import ModifiersTableSkeleton from "./components/table.skeleton";

export const ModifiersTable = dynamic(() => import("./components/table"), {
  suspense: true,
  ssr: false,
});

export const ModifiersPage: AppPage = () => {
  return (
    <Paper>
      <React.Suspense fallback={<ModifiersTableSkeleton />}>
        <ModifiersTable />
      </React.Suspense>
      <Stack direction="row" alignItems="center" className="ui-p-8">
        <CreateModifierModal />
      </Stack>
    </Paper>
  );
};

ModifiersPage.getLayout = page => {
  return <AdminPanelLayout>{page}</AdminPanelLayout>;
};

export default ModifiersPage;