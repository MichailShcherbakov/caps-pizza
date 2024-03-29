import React from "react";
import { Button, Stack } from "@mui/material";
import AppPage from "~/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateDiscountModal from "~/components/modals/discounts-modals/create-discount.modal";
import DiscountsTable from "~/components/tables/discounts-table";
import { GetServerSideProps } from "next";
import withAuth from "~/helpers/with-auth";
import Head from "next/head";

export const DiscountsPage: AppPage = () => {
  return (
    <>
      <DiscountsTable />
      <Stack direction="row" alignItems="center" px={2}>
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
  return (
    <AdminPanelLayout>
      <Head>
        <title>Панель администратора - Скидки</title>
      </Head>
      {page}
    </AdminPanelLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth;

export default DiscountsPage;
