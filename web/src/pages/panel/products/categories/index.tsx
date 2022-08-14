import React from "react";
import { Button, Stack } from "@mui/material";
import AppPage from "~/common/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import dynamic from "next/dynamic";
import ProductCategoriesTableSkeleton from "./components/table/skeleton";
import CreateProductCategoryModal from "./components/modals/create-product-category.modal";

const ProductCategoriesTable = dynamic(() => import("./components/table"), {
  suspense: true,
  ssr: false,
});

export const ProductCategoriesPage: AppPage = () => {
  return (
    <>
      <React.Suspense fallback={<ProductCategoriesTableSkeleton />}>
        <ProductCategoriesTable />
      </React.Suspense>
      <Stack direction="row" alignItems="center" className="ui-p-8">
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

export default ProductCategoriesPage;
