import React from "react";
import { Button, Stack } from "@mui/material";
import { GetServerSideProps } from "next";
import AppPage from "~/interfaces/app-page.interface";
import withAuth from "~/helpers/with-auth";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreatePaymentModal from "~/components/modals/payments-modals/create-payment.modal";
import PaymentsTable from "~/components/tables/payments-table";
import Head from "next/head";

export const PaymentsPage: AppPage = () => {
  return (
    <>
      <PaymentsTable />
      <Stack direction="row" alignItems="center" px={2}>
        <CreatePaymentModal>
          {({ open }) => (
            <Button variant="outlined" color="secondary" onClick={open}>
              Добавить
            </Button>
          )}
        </CreatePaymentModal>
      </Stack>
    </>
  );
};

PaymentsPage.getLayout = page => {
  return (
    <AdminPanelLayout>
      <Head>
        <title>Панель администратора - Оплата</title>
      </Head>
      {page}
    </AdminPanelLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth;

export default PaymentsPage;
