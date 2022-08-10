import React from "react";
import { Paper, Stack } from "@mui/material";
import AppPage from "~/common/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateProductModal from "./components/modals/create-product.modal";
import dynamic from "next/dynamic";

const ProductsTable = dynamic(() => import("./components/table"), {
  suspense: true,
  ssr: false,
});

export const ProductsPage: AppPage = () => {
  return (
    <Paper>
      <React.Suspense>
        <ProductsTable />
      </React.Suspense>
      <Stack direction="row" alignItems="center" className="ui-p-8">
        <CreateProductModal />
      </Stack>
    </Paper>
  );
};

ProductsPage.getLayout = page => {
  return <AdminPanelLayout>{page}</AdminPanelLayout>;
};

export default ProductsPage;
