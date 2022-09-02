import React from "react";
import { Button, Stack } from "@mui/material";
import AppPage from "~/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateProductCategoryModal from "~/components/modals/product-categories-modals/create-product-category.modal";
import ProductCategoriesTable from "~/components/tables/product-categories-table";
import { GetServerSideProps } from "next";
import withAuth from "~/helpers/with-auth";

export const ProductCategoriesPage: AppPage = () => {
  return (
    <>
      <ProductCategoriesTable />
      <Stack direction="row" alignItems="center" px={2}>
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
