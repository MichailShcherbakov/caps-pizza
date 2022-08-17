import React from "react";
import { Button, Stack } from "@mui/material";
import AppPage from "~/common/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateProductCategoryModal from "./components/modals/create-product-category.modal";
import ProductCategoriesTable from "./components/table";
import { GetServerSideProps } from "next";
import withAuth from "~/common/helpers/with-auth";

export const ProductCategoriesPage: AppPage = () => {
  return (
    <>
      <ProductCategoriesTable />
      <Stack direction="row" alignItems="center" className="ui-px-8">
        <CreateProductCategoryModal>
          {({ open }) => (
            <Button variant="outlined" color="secondary" onClick={open}>
              Добавить
            </Button>
          )}
        </CreateProductCategoryModal>
      </Stack>
    </>
  );
};

ProductCategoriesPage.getLayout = page => {
  return <AdminPanelLayout>{page}</AdminPanelLayout>;
};

export const getServerSideProps: GetServerSideProps = withAuth;

export default ProductCategoriesPage;
