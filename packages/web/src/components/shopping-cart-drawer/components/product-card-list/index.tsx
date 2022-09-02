import React from "react";
import { Stack } from "@mui/material";
import useShoppingCart from "~/hooks/use-shopping-cart";
import ProductCard from "../product-card";
import EmptyStub from "../empty-stub";
import { useStyle } from "./index.style";

export interface ProductCardListProps {}

export const ProductCardList = () => {
  const { products, isLoading } = useShoppingCart();
  const { classes } = useStyle({
    empty: isLoading || !products.length,
  });

  return (
    <Stack className={classes.root}>
      {isLoading || !products.length ? (
        <EmptyStub />
      ) : (
        products.map(product => (
          <ProductCard
            key={
              product.uuid +
              product.modifiers.reduce(
                (uuid, modifier) => uuid + modifier.uuid,
                ""
              )
            }
            product={product}
          />
        ))
      )}
    </Stack>
  );
};

export default ProductCardList;
