import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import { Modifier } from "~/services/modifiers.service";
import { Product } from "~/services/products.service";
import getSpecifics from "../helpers/getSpecifics.helper";
import useShoppingCartActions from "~/hooks/use-shopping-cart-actions";
import styles from "./index.module.scss";

export interface ProductPriceProps {
  product: Product;
  currentModifiers: Modifier[];
}

export const ProductPrice: React.FC<ProductPriceProps> = ({
  product,
  currentModifiers,
}) => {
  const { addProduct } = useShoppingCartActions();
  const specifics = React.useMemo(() => getSpecifics(product), [product]);

  const price = React.useMemo(
    () =>
      currentModifiers.reduce(
        (price, modifier) => price + modifier.price,
        product.price
      ),
    [product, currentModifiers]
  );

  const onProductCardSelect = React.useCallback(
    () =>
      addProduct({
        uuid: product.uuid,
        modifiers: currentModifiers.map(modifier => ({
          uuid: modifier.uuid,
        })),
      }),
    [product, currentModifiers, addProduct]
  );

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      className={styles["product-card__footer"]}
    >
      <Typography
        variant="subtitle1"
        className={styles["product-card__footer-specifics"]}
      >
        {specifics}
      </Typography>
      <Button
        variant="outlined"
        className={styles["product-card__footer-btn"]}
        onClick={onProductCardSelect}
      >
        <Typography
          variant="button"
          className={styles["product-card__footer-btn-text"]}
        >
          Выбрать
        </Typography>
        <Typography
          variant="button"
          className={styles["product-card__footer-btn-price"]}
        >
          {price} ₽
        </Typography>
      </Button>
      <Typography
        variant="h4"
        component="p"
        className={styles["product-card__price"]}
      >
        {price} ₽
      </Typography>
    </Stack>
  );
};

export default ProductPrice;
