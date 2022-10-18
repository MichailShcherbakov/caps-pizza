import React from "react";
import { Button, Stack } from "@mui/material";
import AppPage from "~/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateDeliveryModal from "~/components/modals/delivery-modals/create-delivery.modal";
import DeliveryTable from "~/components/tables/delivery-table";
import { GetServerSideProps } from "next";
import withAuth from "~/helpers/with-auth";
import Head from "next/head";

export const DeliveryPage: AppPage = () => {
  return (
    <>
      <DeliveryTable />
      <Stack direction="row" alignItems="center" px={2}>
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
  return (
    <AdminPanelLayout>
      <Head>
        <title>Панель администратора - Доставка</title>
      </Head>
      {page}
    </AdminPanelLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth;

export default DeliveryPage;
