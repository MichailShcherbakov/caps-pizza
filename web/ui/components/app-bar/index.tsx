import { StackProps } from "@mui/material";
import { Fade, Container, Stack, Typography } from "@mui/material";
import React from "react";
import Categories from "./components/categories";
import Logo from "./components/logo";
import ShoppingCartButton from "../shopping-cart-button";
import styles from "./index.module.scss";

export interface AppBarProps extends StackProps {}

export const APP_BAR_TOP_OFFSET = 210;

export const AppBar: React.FC<AppBarProps> = (props) => {
  const [showCategories, setShowCatefories] = React.useState<boolean>(false);
  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const scroll = () => {
      setShowCatefories(window?.scrollY > APP_BAR_TOP_OFFSET);
    };

    window.addEventListener("scroll", scroll);

    return () => {
      window.removeEventListener("scroll", scroll);
    };
  }, []);

  return (
    <Stack ref={ref} component="header" {...props}>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          className={styles["app-bar"]}
        >
          <Logo onlyIcon={showCategories} />
          {showCategories && (
            <Fade in={showCategories}>
              <Categories />
            </Fade>
          )}
          <ShoppingCartButton />
        </Stack>
      </Container>
    </Stack>
  );
};

export default AppBar;
