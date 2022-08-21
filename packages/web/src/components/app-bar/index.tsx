import React from "react";
import { StackProps } from "@mui/material";
import { Fade, Container, Stack } from "@mui/material";
import CategoriesList from "~/components/categories-list";
import ShoppingCartButton from "~/components/shopping-cart-button";
import useScroll from "~/hooks/use-scroll";
import Logo from "./components/logo";
import styles from "./index.module.scss";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";
import { useMediaQuery } from "~/ui";
import useShoppingCart from "~/hooks/use-shopping-cart";

const APP_BAR_SMALL_SCREEN_TOP_OFFSET = 100;
const APP_BAR_LARGE_SCREEN_TOP_OFFSET = 150;

export interface AppBarProps extends StackProps {}

export const AppBar: React.FC<AppBarProps> = props => {
  const breakpoint = useMediaQuery(theme => theme.breakpoints.up("md"));
  const { totalCost } = useShoppingCart();
  const { data: productCategories = [] } = useGetProductCategoriesQuery();

  useScroll({
    onScrollChange: () => {
      const offset = breakpoint
        ? APP_BAR_LARGE_SCREEN_TOP_OFFSET
        : APP_BAR_SMALL_SCREEN_TOP_OFFSET;
      setShowCategories(window.scrollY > offset);
    },
  });

  const [showCategories, setShowCategories] = React.useState<boolean>(false);

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
          <Logo onlyIcon={showCategories} />
          {showCategories ? (
            <Fade in={showCategories} unmountOnExit>
              <CategoriesList fullWidth categories={productCategories} />
            </Fade>
          ) : undefined}
          <ShoppingCartButton price={totalCost} />
        </Stack>
      </Container>
    </Stack>
  );
};

export default AppBar;
