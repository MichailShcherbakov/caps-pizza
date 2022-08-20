import { Button, Stack } from "@mui/material";
import { GetServerSideProps } from "next";
import React from "react";
import AppPage from "~/interfaces/app-page.interface";
import withAuth from "~/helpers/with-auth";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateModifierCategoryModal from "~/components/modals/modifier-categories-modals/create-modifier-category.modal";
import ModifierCategoriesTable from "~/components/tables/modifier-categories-table";

export const ModifierCategoriesPage: AppPage = () => {
  return (
    <>
      <ModifierCategoriesTable />
      <Stack direction="row" alignItems="center" className="ui-px-8">
        <CreateModifierCategoryModal>
          {({ open }) => (
            <Button variant="outlined" color="secondary" onClick={open}>
              Добавить
            </Button>
          )}
        </CreateModifierCategoryModal>
      </Stack>
    </>
  );
};

ModifierCategoriesPage.getLayout = page => {
  return <AdminPanelLayout>{page}</AdminPanelLayout>;
};

export const getServerSideProps: GetServerSideProps = withAuth;

export default ModifierCategoriesPage;
