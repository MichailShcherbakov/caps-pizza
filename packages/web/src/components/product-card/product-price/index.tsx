import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import { Modifier } from "~/services/modifiers.service";
import { Product } from "~/services/products.service";
import getSpecifics from "../helpers/getSpecifics.helper";

import { Snackbar } from "~/ui";
import { useStyle } from "./index.style";
import { ProductConstructorModal } from "~/components/modals/product-constructor";
import { ModifierCategory } from "~/services/modifier-categories.service";
import useShoppingCartActions from "~/hooks/use-shopping-cart-actions";

export interface ProductPriceProps {
  product: Product;
  modifiers: Modifier[];
  modifierCategories: ModifierCategory[];
}

export const ProductPrice: React.FC<ProductPriceProps> = ({
  product,
  modifiers,
  modifierCategories,
}) => {
  const { classes } = useStyle();
  const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
  const specifics = React.useMemo(() => getSpecifics(product), [product]);

  const price = React.useMemo(
    () =>
      product.modifiers.reduce(
        (price, modifier) => price + modifier.price,
        product.price
      ),
    [product]
  );

  const handleClose = React.useCallback(() => {
    setShowSnackbar(false);
  }, []);

  const { addProduct } = useShoppingCartActions();

  const onProductCardSelect = React.useCallback(() => {
    addProduct({
      uuid: product.uuid,
      modifiers: [],
    });

    setShowSnackbar(true);
  }, [product, addProduct]);

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1" className={classes.specifics}>
          {specifics}
        </Typography>
        <Typography variant="h4" component="p" className={classes.price}>
          {Boolean(product.modifiers.length) && "от"} {price} ₽
        </Typography>
        {product.modifiers.length ? (
          <ProductConstructorModal
            product={product}
            modifiers={modifiers}
            modifierCategories={modifierCategories}
          >
            {({ open }) => (
              <Button variant="outlined" onClick={open}>
                Выбрать
              </Button>
            )}
          </ProductConstructorModal>
        ) : (
          <Button variant="outlined" onClick={onProductCardSelect}>
            Выбрать
          </Button>
        )}
      </Stack>
      <Snackbar
        open={showSnackbar}
        onClose={handleClose}
        label="Товар добавлен в корзину"
      />
    </>
  );
};

export default ProductPrice;
