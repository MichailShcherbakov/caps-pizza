import React from "react";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ProductCard from "../product-card";
import styles from "./index.module.scss";
import { useAppSelector } from "~/store/hook";
import EmptyStub from "../empty-stub";

export interface PopoverProps {
  anchor?: "left" | "top" | "right" | "bottom";
  onClose?: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
}

export const computeFinalPrice = (products) => {
  let finalPrice = 0;

  for (const product of products) {
    finalPrice += product.price * product.count;
  }

  return finalPrice;
};

export const Popover: React.FC<PopoverProps> = ({
  anchor = "right",
  onClose = () => {},
}) => {
  const orderedProducts = useAppSelector((state) => state.order.products);
  const isEmpty = !orderedProducts.length;
  const finalPrict = computeFinalPrice(orderedProducts);

  const onCountChangedHandler = (id: number, newCount: number) => {
    /* setProducts(
      products.map((p) => {
        if (p.id !== id) return p;

        return {
          ...p,
          count: newCount,
        };
      })
    ); */
  };

  return (
    <Stack
      justifyContent="space-between"
      className={[
        styles["shopping-cart-drawer"],
        isEmpty ? styles["shopping-cart-drawer--empty"] : "",
        anchor === "bottom" ? styles["shopping-cart-drawer--bottom"] : "",
      ].join(" ")}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        className={styles["shopping-cart-drawer__header"]}
      >
        {!isEmpty && <Typography variant="h1">Ваш заказ</Typography>}
        <IconButton onClick={(e) => onClose(e, "backdropClick")} size="medium">
          <ArrowForwardIosIcon
            className={styles[`shopping-cart-drawer__back-btn--${anchor}`]}
          />
        </IconButton>
      </Stack>
      <Stack className={styles["shopping-cart-drawer__product-list"]}>
        {orderedProducts.map((p) => (
          <ProductCard
            key={p.uuid}
            uuid={p.uuid}
            name={p.name}
            desc={p.desc}
            price={440}
            specifics={`${"30см"} / ${"720г"}`}
            imageURL={p.imageURL}
            count={p.count}
            onCountChanged={onCountChangedHandler}
          />
        ))}
        {isEmpty && <EmptyStub />}
      </Stack>
      {!isEmpty && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          className={styles["shopping-cart-drawer__footer"]}
        >
          <Typography
            variant="h4"
            component="span"
            className={styles["shopping-cart-drawer__final-price"]}
          >
            Итого: {finalPrict}
          </Typography>
          <Button variant="contained">
            <Typography variant="button">Оформить заказ</Typography>
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default Popover;
