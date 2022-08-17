import { Button, Stack } from "@mui/material";
import { GetServerSideProps } from "next";
import React from "react";
import AppPage from "~/common/interfaces/app-page.interface";
import withAuth from "~/common/helpers/with-auth";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateModifierModal from "./components/modals/create-modifier.modal";
import ModifiersTable from "./components/table";

export const ModifiersPage: AppPage = () => {
  return (
    <>
      <ModifiersTable />
      <Stack direction="row" alignItems="center" className="ui-px-8">
        <CreateModifierModal>
          {({ open }) => (
            <Button variant="outlined" color="secondary" onClick={open}>
              Добавить
            </Button>
          )}
        </CreateModifierModal>
      </Stack>
    </>
  );
};

ModifiersPage.getLayout = page => {
  return <AdminPanelLayout>{page}</AdminPanelLayout>;
};

export const getServerSideProps: GetServerSideProps = withAuth;

export default ModifiersPage;
