import { GetServerSideProps } from "next";
import React from "react";
import { Button, Stack } from "@mui/material";
import AppPage from "~/common/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateProductModal from "./components/modals/create-product.modal";
import ProductsTable from "./components/table";
import withAuth from "~/common/helpers/with-auth";

export const ProductsPage: AppPage = () => {
  return (
    <>
      <ProductsTable />
      <Stack direction="row" alignItems="center" className="ui-px-8">
        <CreateProductModal>
          {({ open }) => (
            <Button variant="outlined" color="secondary" onClick={open}>
              Добавить
            </Button>
          )}
        </CreateProductModal>
      </Stack>
    </>
  );
};

ProductsPage.getLayout = page => {
  return <AdminPanelLayout>{page}</AdminPanelLayout>;
};

export const getServerSideProps: GetServerSideProps = withAuth;

export default ProductsPage;
