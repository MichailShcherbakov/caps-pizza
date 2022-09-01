import React from "react";
import {
  AppBar as MUIAppBar,
  AppBarProps as MUIAppBarProps,
} from "@mui/material";
import { Fade, Stack } from "@mui/material";
import CategoriesList from "~/components/categories-list";
import useScroll from "~/hooks/use-scroll";
import Logo from "./components/logo";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";
import dynamic from "next/dynamic";
import { Container } from "@mui/system";
import { useStyle } from "./index.style";

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

export interface AppBarProps extends MUIAppBarProps {}

export const AppBar: React.FC<AppBarProps> = ({ className, ...props }) => {
  const { classes, cx } = useStyle();

  return (
    <MUIAppBar
      {...props}
      position="sticky"
      className={cx(classes.root, className)}
    >
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          className={classes.container}
        >
          <AppBarHead />
          <React.Suspense>
            <ShoppingCartButton />
          </React.Suspense>
        </Stack>
      </Container>
    </MUIAppBar>
  );
};

export default AppBar;
