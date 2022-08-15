import React from "react";
import { Button, Stack } from "@mui/material";
import AppPage from "~/common/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateDeliveryModal from "./components/modals/create-delivery.modal";
import dynamic from "next/dynamic";
import DeliveryTableSkeleton from "./components/table/skeleton";

const DeliveryTable = dynamic(() => import("./components/table"), {
  suspense: true,
  ssr: false,
});

export const DeliveryPage: AppPage = () => {
  return (
    <>
      <React.Suspense fallback={<DeliveryTableSkeleton />}>
        <DeliveryTable />
      </React.Suspense>
      <Stack direction="row" alignItems="center" className="ui-p-8">
        <CreateDeliveryModal>
          {({ open }) => (
            <Button variant="outlined" color="secondary" onClick={open}>
              Добавить
            </Button>
          )}
        </CreateDeliveryModal>
      </Stack>
    </>
  );
};

DeliveryPage.getLayout = page => {
  return <AdminPanelLayout>{page}</AdminPanelLayout>;
};

export default DeliveryPage;
