import { Button, Stack } from "@mui/material";
import { GetServerSideProps } from "next";
import React from "react";
import AppPage from "~/interfaces/app-page.interface";
import withAuth from "~/helpers/with-auth";
import AdminPanelLayout from "~/layouts/admin-panel";
import CreateModifierModal from "~/components/modals/modifiers-modals/create-modifier.modal";
import ModifiersTable from "~/components/tables/modifiers-table";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import CreateAnotherObjectModal from "~/components/notifications/modals/create-another-object.notification";
import { useRouter } from "next/router";

export const ModifiersPage: AppPage = () => {
  const router = useRouter();
  const { data: modifierCategories = [] } = useGetModifierCategoriesQuery();

  return (
    <>
      <ModifiersTable />
      <Stack direction="row" alignItems="center" px={2}>
        <CreateModifierModal>
          {({ open: openCreateModifierModal }) => (
            <CreateAnotherObjectModal
              title="Отсутсвуют типы модификаторов"
              desc="Чтобы создать модификатор, сперва создайте тип модификаторов"
              onAccept={() => router.push("/panel/modifiers/categories")}
            >
              {({ open: openCreateAnotherObjectModal }) => (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    if (!modifierCategories.length) {
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
