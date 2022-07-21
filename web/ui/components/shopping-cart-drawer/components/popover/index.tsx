import React from "react";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ProductCard from "../product-card";
import styles from "./index.module.scss";

export interface PopoverProps {
  anchor?: "left" | "top" | "right" | "bottom";
  onClose?: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
}

export const TEST_PRODUCTS = [
  {
    id: 0,
    name: "Пицца Маргарита",
    desc: "Томатный соус, сыр моцарелла, базилик",
    price: 440,
    size: "30 см",
    weight: "760 гр",
    iconURL: "/pizza/margarita.png",
    count: 5,
  },
  {
    id: 1,
    name: "Пицца Маргарита",
    desc: "Томатный соус, сыр моцарелла, базилик",
    price: 440,
    size: "30 см",
    weight: "760 гр",
    iconURL: "/pizza/margarita.png",
    count: 1,
  },
  {
    id: 2,
    name: "Пицца Маргарита",
    desc: "Томатный соус, сыр моцарелла, базилик",
    price: 440,
    size: "30 см",
    weight: "760 гр",
    iconURL: "/pizza/margarita.png",
    count: 2,
  },
];

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
  const [products, setProducts] = React.useState(TEST_PRODUCTS);

  const onCountChangedHandler = (id: number, newCount: number) => {
    setProducts(
      products.map((p) => {
        if (p.id !== id) return p;

        return {
          ...p,
          count: newCount,
        };
      })
    );
  };

  return (
    <Stack
      justifyContent="space-between"
      className={[
        styles["shopping-cart-drawer"],
        anchor === "bottom" ? styles["shopping-cart-drawer--bottom"] : "",
      ].join(" ")}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        className={styles["shopping-cart-drawer__header"]}
      >
        <Typography variant="h1">Ваш заказ</Typography>
        <IconButton onClick={(e) => onClose(e, "backdropClick")} size="medium">
          <ArrowForwardIosIcon
            className={styles[`shopping-cart-drawer__back-btn--${anchor}`]}
          />
        </IconButton>
      </Stack>
      <Stack className={styles["shopping-cart-drawer__product-list"]}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            desc={p.desc}
            price={p.price}
            specifics={`${p.size} / ${p.weight}`}
            iconURL={p.iconURL}
            count={p.count}
            onCountChanged={onCountChangedHandler}
          />
        ))}
      </Stack>
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
          Итого: {computeFinalPrice(products)}
        </Typography>
        <Button variant="contained">
          <Typography variant="button">Оформить заказ</Typography>
        </Button>
      </Stack>
    </Stack>
  );
};

export default Popover;
