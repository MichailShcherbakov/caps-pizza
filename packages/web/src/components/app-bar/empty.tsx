import React from "react";
import {
  AppBar as MUIAppBar,
  AppBarProps as MUIAppBarProps,
} from "@mui/material";
import { Stack } from "@mui/material";
import Logo from "./components/logo";
import dynamic from "next/dynamic";
import { Container } from "@mui/system";
import { useStyle } from "./index.style";

const ShoppingCartButton = dynamic(() => import("../shopping-cart-button"), {
  suspense: true,
  ssr: false,
});

export interface AppBarProps extends MUIAppBarProps {}

export const EmptyAppBar: React.FC<AppBarProps> = ({ className, ...props }) => {
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
          <Logo />
          <React.Suspense>
            <ShoppingCartButton />
          </React.Suspense>
        </Stack>
      </Container>
    </MUIAppBar>
  );
};

export default EmptyAppBar;
