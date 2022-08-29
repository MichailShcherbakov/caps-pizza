import { IconButton, Stack, Typography } from "@mui/material";
import NextImage from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./index.module.scss";
import CounterButton from "~/ui/components/buttons/counter-button";
import getSpecifics from "~/components/product-card/helpers/getSpecifics.helper";
import { ShoppingCartProduct } from "~/hooks/use-shopping-cart";
import React from "react";
import useShoppingCartActions from "~/hooks/use-shopping-cart-actions";

export interface ProductCardProps {
  product: ShoppingCartProduct;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ product }) => {
    const { addProduct, removeProduct } = useShoppingCartActions();

    const productModifiers = product.modifiers.map(modifier => ({
      uuid: modifier.uuid,
    }));

    return (
      <Stack
        direction="row"
        alignItems="stretch"
        className={styles["product-card"]}
      >
        <Stack className={styles["product-card__image"]}>
          <NextImage
            src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${product.image_url}`}
            alt={product.name}
            layout="fill"
            className={styles["product-card__image-src"]}
          />
        </Stack>
        <Stack spacing={1} className="ui-w-full">
          <Stack spacing={1} className="ui-w-full ui-h-full">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              className="ui-w-full"
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
            <Typography variant="h5" className={styles["product-card__price"]}>
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
