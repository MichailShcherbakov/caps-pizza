import React from "react";
import { Button, Stack } from "@mui/material";
import AppPage from "~/common/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateDiscountModal from "./components/modals/create-discount.modal";
import dynamic from "next/dynamic";
import DiscountsTableSkeleton from "./components/table/skeleton";

const DiscountsTable = dynamic(() => import("./components/table"), {
  suspense: true,
  ssr: false,
});

export const DiscountsPage: AppPage = () => {
  return (
    <>
      <React.Suspense fallback={<DiscountsTableSkeleton />}>
        <DiscountsTable />
      </React.Suspense>
      <Stack direction="row" alignItems="center">
        <CreateDiscountModal>
          {({ open }) => (
            <Button variant="outlined" color="secondary" onClick={open}>
              Добавить
            </Button>
          )}
        </CreateDiscountModal>
      </Stack>
    </>
  );
};

DiscountsPage.getLayout = page => {
  return <AdminPanelLayout>{page}</AdminPanelLayout>;
};

export default DiscountsPage;
