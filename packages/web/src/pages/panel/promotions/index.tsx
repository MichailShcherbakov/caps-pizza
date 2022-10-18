import { Button, Stack } from "@mui/material";
import { GetServerSideProps } from "next";
import React from "react";
import AppPage from "~/interfaces/app-page.interface";
import withAuth from "~/helpers/with-auth";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreatePromotionModal from "~/components/modals/promotions-modals/create-promotion.modal";
import PromotionsTable from "~/components/tables/promotions-table";
import Head from "next/head";

export const PromotionsPage: AppPage = () => {
  return (
    <>
      <PromotionsTable />
      <Stack direction="row" alignItems="center" px={2}>
        <CreatePromotionModal>
          {({ open }) => (
            <Button variant="outlined" color="secondary" onClick={open}>
              Добавить
            </Button>
          )}
        </CreatePromotionModal>
      </Stack>
    </>
  );
};

PromotionsPage.getLayout = page => {
  return (
    <AdminPanelLayout>
      <Head>
        <title>Панель администратора - Акции</title>
      </Head>
      {page}
    </AdminPanelLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth;

export default PromotionsPage;
