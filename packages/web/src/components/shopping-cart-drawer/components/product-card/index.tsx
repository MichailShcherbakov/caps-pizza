import { IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CounterButton from "~/ui/components/buttons/counter-button";
import getSpecifics from "~/components/product-card/helpers/getSpecifics.helper";
import { ShoppingCartProduct } from "~/hooks/use-shopping-cart";
import React from "react";
import useShoppingCartActions from "~/hooks/use-shopping-cart-actions";
import { useStyle } from "./index.style";
import ProductImage from "./product-image";

export interface ProductCardProps {
  product: ShoppingCartProduct;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ product }) => {
    const { classes } = useStyle();
    const { addProduct, removeProduct } = useShoppingCartActions();

    const productModifiers = product.modifiers.map(modifier => ({
      uuid: modifier.uuid,
    }));

    return (
      <Stack direction="row" alignItems="stretch" className={classes.root}>
        <ProductImage productName={product.name} imageURL={product.image_url} />
        <Stack width="100%" spacing={1}>
          <Stack width="100%" height="100%" spacing={1}>
            <Stack width="100%" direction="row" justifyContent="space-between">
              <Typography variant="h4">{product.name}</Typography>
              <IconButton
                size="small"
                sx={{
                  height: "fit-content",
                }}
                onClick={() =>
                  removeProduct(
                    {
                      uuid: product.uuid,
                      modifiers: productModifiers,
                    },
                    true
                  )
                }
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Stack>
              {product.modifiers.map(modifier =>
                modifier.display ? (
                  <Typography key={modifier.uuid}>
                    {modifier.name[0].toUpperCase() +
                      modifier.name
                        .slice(1, modifier.name.length)
                        .toLowerCase()}
                  </Typography>
                ) : null
              )}
            </Stack>
            <Typography variant="subtitle1">{getSpecifics(product)}</Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <CounterButton
              minValue={0}
              initialCount={product.count}
              onIncrement={() =>
                addProduct({
                  uuid: product.uuid,
                  modifiers: productModifiers,
                })
              }
              onDecrement={() =>
                removeProduct({
                  uuid: product.uuid,
                  modifiers: productModifiers,
                })
              }
            />
            <Typography component="span" variant="h5" className={classes.price}>
              {`${product.fullPrice * product.count} ₽`}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
