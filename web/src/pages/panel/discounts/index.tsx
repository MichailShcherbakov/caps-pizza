import React from "react";
import { Paper, Stack } from "@mui/material";
import AppPage from "~/common/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateDiscountModal from "./components/modals/create-discount.modal";
import dynamic from "next/dynamic";
import DiscountsTableSkeleton from "./components/table.skeleton";

const DiscountsTable = dynamic(() => import("./components/table"), {
  suspense: true,
  ssr: false,
});

export const DiscountsPage: AppPage = () => {
  return (
    <Paper>
      <React.Suspense fallback={<DiscountsTableSkeleton />}>
        <DiscountsTable />
      </React.Suspense>
      <Stack direction="row" alignItems="center" className="ui-p-8">
        <CreateDiscountModal />
      </Stack>
    </Paper>
  );
};

DiscountsPage.getLayout = page => {
  return <AdminPanelLayout>{page}</AdminPanelLayout>;
};

export default DiscountsPage;
