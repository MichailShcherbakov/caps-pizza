import React from "react";
import { StackProps } from "@mui/material";
import { Fade, Container, Stack } from "@mui/material";
import CategoriesList from "~/components/categories-list";
import useScroll from "~/hooks/use-scroll";
import Logo from "./components/logo";
import styles from "./index.module.scss";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";
import dynamic from "next/dynamic";

const ShoppingCartButton = dynamic(() => import("../shopping-cart-button"), {
  suspense: true,
  ssr: false,
});

const APP_BAR_SMALL_SCREEN_TOP_OFFSET = 100;
const APP_BAR_LARGE_SCREEN_TOP_OFFSET = 150;

export const AppBarHead = () => {
  const { data: productCategories = [] } = useGetProductCategoriesQuery();
  const [showCategories, setShowCategories] = React.useState<boolean>(false);

  useScroll({
    onScrollChange: () => {
      const offset =
        window.innerWidth > 900
          ? APP_BAR_LARGE_SCREEN_TOP_OFFSET
          : APP_BAR_SMALL_SCREEN_TOP_OFFSET;
      setShowCategories(window.scrollY > offset);
    },
  });

  return (
    <>
      <Logo onlyIcon={showCategories} />
      {showCategories ? (
        <Fade in={showCategories} unmountOnExit>
          <CategoriesList fullWidth categories={productCategories} />
        </Fade>
      ) : undefined}
    </>
  );
};

export interface AppBarProps extends StackProps {}

export const AppBar: React.FC<AppBarProps> = props => {
  return (
    <Stack
      {...props}
      component="header"
      alignItems="center"
      justifyContent="space-between"
      className={styles["app-bar"]}
    >
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <AppBarHead />
          <React.Suspense>
            <ShoppingCartButton />
          </React.Suspense>
        </Stack>
      </Container>
    </Stack>
  );
};

export default AppBar;
