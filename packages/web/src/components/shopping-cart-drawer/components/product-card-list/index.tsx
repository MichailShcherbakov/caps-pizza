import React from "react";
import { Stack } from "@mui/material";
import useShoppingCart from "~/hooks/use-shopping-cart";
import ProductCard from "../product-card";
import EmptyStub from "../empty-stub";
import styles from "./index.module.scss";

export interface ProductCardListProps {}

export const ProductCardList = () => {
  const { products } = useShoppingCart();
  const isEmpty = !products.length;

  return (
    <Stack className={styles["shopping-cart-drawer__product-list"]}>
      {isEmpty ? (
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
