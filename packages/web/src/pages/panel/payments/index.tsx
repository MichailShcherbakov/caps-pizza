import React from "react";
import { Button, Stack } from "@mui/material";
import { GetServerSideProps } from "next";
import AppPage from "~/interfaces/app-page.interface";
import withAuth from "~/helpers/with-auth";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreatePaymentModal from "~/components/modals/payments-modals/create-payment.modal";
import PaymentsTable from "~/components/tables/payments-table";

export const PaymentsPage: AppPage = () => {
  return (
    <>
      <PaymentsTable />
      <Stack direction="row" alignItems="center" className="ui-px-8">
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
  return <AdminPanelLayout>{page}</AdminPanelLayout>;
};

export const getServerSideProps: GetServerSideProps = withAuth;

export default PaymentsPage;
