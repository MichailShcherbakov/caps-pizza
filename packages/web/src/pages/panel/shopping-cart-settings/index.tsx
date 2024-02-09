import React from "react";
import AppPage from "~/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import { GetServerSideProps } from "next";
import withAuth from "~/helpers/with-auth";
import Head from "next/head";
import ShoppingCartSettingsForm from "~/components/forms/shopping-cart-settings";

export const ShoppingCartSettingsPage: AppPage = () => {
  return <ShoppingCartSettingsForm />;
};

ShoppingCartSettingsPage.getLayout = page => {
  return (
    <AdminPanelLayout>
      <Head>
        <title>Панель администратора - Настройки корзины покупок</title>
      </Head>
      {page}
    </AdminPanelLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth;

export default ShoppingCartSettingsPage;
