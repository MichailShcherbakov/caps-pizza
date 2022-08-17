import React from "react";
import { Button, Stack } from "@mui/material";
import AppPage from "~/common/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateDiscountModal from "./components/modals/create-discount.modal";
import DiscountsTable from "./components/table";
import { GetServerSideProps } from "next";
import withAuth from "~/common/helpers/with-auth";

export const DiscountsPage: AppPage = () => {
  return (
    <>
      <DiscountsTable />
      <Stack direction="row" alignItems="center" className="ui-px-8">
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

export const getServerSideProps: GetServerSideProps = withAuth;

export default DiscountsPage;
