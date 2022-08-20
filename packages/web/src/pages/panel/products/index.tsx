import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Button, Stack } from "@mui/material";
import AppPage from "~/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateProductModal from "~/components/modals/products-modals/create-product.modal";
import ProductsTable from "~/components/tables/products-table";
import withAuth from "~/helpers/with-auth";
import CreateAnotherObjectModal from "~/components/notifications/modals/create-another-object.notification";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";

export const ProductsPage: AppPage = () => {
  const router = useRouter();
  const { data: productCategories = [] } = useGetProductCategoriesQuery();

  return (
    <>
      <ProductsTable />
      <Stack direction="row" alignItems="center" className="ui-px-8">
        <CreateProductModal>
          {({ open: openCreateModifierModal }) => (
            <CreateAnotherObjectModal
              title="Отсутсвуют категории товаров"
              desc="Чтобы создать товар, сперва создайте категорию товаров"
              onAccept={() => router.push("/panel/products/categories")}
            >
              {({ open: openCreateAnotherObjectModal }) => (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    if (!productCategories.length) {
                      openCreateAnotherObjectModal();
                      return;
                    }

                    openCreateModifierModal();
                  }}
                >
                  Добавить
                </Button>
              )}
            </CreateAnotherObjectModal>
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
