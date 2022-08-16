import React from "react";
import { Button, Stack } from "@mui/material";
import AppPage from "~/common/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateProductModal from "./components/modals/create-product.modal";
import dynamic from "next/dynamic";
import ProductsTableSkeleton from "./components/table/skeleton";

const ProductsTable = dynamic(() => import("./components/table"), {
  suspense: true,
  ssr: false,
});

export const ProductsPage: AppPage = () => {
  return (
    <>
      <React.Suspense fallback={<ProductsTableSkeleton />}>
        <ProductsTable />
      </React.Suspense>
      <Stack direction="row" alignItems="center">
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

export default ProductsPage;
