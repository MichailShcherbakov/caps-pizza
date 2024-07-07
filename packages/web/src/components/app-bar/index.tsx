import React from "react";
import {
  AppBar as MUIAppBar,
  AppBarProps as MUIAppBarProps,
} from "@mui/material";
import { Fade, Stack } from "@mui/material";
import CategoriesList from "~/components/categories-list";
import useScroll from "~/hooks/use-scroll";
import Logo from "./components/logo";
import dynamic from "next/dynamic";
import { Container } from "@mui/system";
import { useStyle } from "./index.style";
import { useDisplayProductCategories } from "~/hooks/user-display-product-categories";

const ShoppingCartButton = dynamic(() => import("../shopping-cart-button"), {
  ssr: false,
});

export const AppBarHead = ({
  appBarRef,
}: {
  appBarRef: HTMLElement | null;
}) => {
  const { displayProductCategories } = useDisplayProductCategories();
  const [showCategories, setShowCategories] = React.useState<boolean>(false);

  useScroll({
    onScrollChange: () => {
      const stopper = document.getElementById(
        "app_bar_stopper"
      ) as HTMLElement | null;

      if (!stopper || !appBarRef) return;

      setShowCategories(
        window.scrollY >
          stopper.offsetTop + stopper.offsetHeight - appBarRef.offsetHeight
      );
    },
  });

  return (
    <>
      <Logo onlyIcon={showCategories} />
      {showCategories ? (
        <Fade in unmountOnExit>
          <CategoriesList fullWidth categories={displayProductCategories} />
        </Fade>
      ) : undefined}
    </>
  );
};

export interface AppBarProps extends MUIAppBarProps {}

export const AppBar: React.FC<AppBarProps> = ({ className, ...props }) => {
  const { classes, cx } = useStyle();
  const [ref, setRef] = React.useState<HTMLElement | null>(null);

  return (
    <MUIAppBar
      {...props}
      ref={setRef}
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
          <AppBarHead appBarRef={ref} />
          <ShoppingCartButton variant="outlined" />
        </Stack>
      </Container>
    </MUIAppBar>
  );
};

export default AppBar;
