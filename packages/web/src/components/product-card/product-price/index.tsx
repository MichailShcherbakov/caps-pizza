import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import { Modifier } from "~/services/modifiers.service";
import { Product } from "~/services/products.service";
import { Snackbar } from "~/ui";
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
  const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);

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
        <Typography variant="h4" component="p" sx={{ whiteSpace: "nowrap" }}>
          {price} ₽
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
