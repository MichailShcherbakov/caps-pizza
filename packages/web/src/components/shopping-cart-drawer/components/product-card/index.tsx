import { IconButton, Stack, Typography } from "@mui/material";
import NextImage from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import CounterButton from "~/ui/components/buttons/counter-button";
import getSpecifics from "~/components/product-card/helpers/getSpecifics.helper";
import { ShoppingCartProduct } from "~/hooks/use-shopping-cart";
import React from "react";
import useShoppingCartActions from "~/hooks/use-shopping-cart-actions";
import { useStyle } from "./index.style";

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
        <Stack className={classes.image}>
          <NextImage
            src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${product.image_url}`}
            alt={product.name}
            layout="fill"
          />
        </Stack>
        <Stack width="100%" spacing={1}>
          <Stack width="100%" height="100%" spacing={1}>
            <Stack
              width="100%"
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h4">{product.name}</Typography>
              <IconButton
                size="small"
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
              {product.modifiers.map(modifier => (
                <Typography key={modifier.uuid}>{`${
                  modifier.category?.name
                } ${modifier.name.toLowerCase()}`}</Typography>
              ))}
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
            <Typography variant="h5" className={classes.price}>
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
