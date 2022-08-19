import React from "react";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ProductCard from "../product-card";
import styles from "./index.module.scss";
import EmptyStub from "../empty-stub";

export interface PopoverProps {
  anchor?: "left" | "top" | "right" | "bottom";
  onClose?: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
}

export const Popover: React.FC<PopoverProps> = ({
  anchor = "right",
  onClose = () => {},
}) => {
  /*   const { orderedProducts, addProduct, removeProduct } = useProductOrderList();
  const totalPrice = useAppSelector(selectTotalOrderPrice);

  const isEmpty = !orderedProducts.length;

  const onCountChangedHandler = (uuid: string, newCount: number) => {
    const product = orderedProducts.find(p => p.orderedProductUUID === uuid);

    if (!product) return;

    if (newCount < product.count) {
      removeProduct(uuid);
      return;
    }

    addProduct({
      productUUID: product.productUUID,
      price: product.price,
    });
  };
 */
  /*   const onProductRemoveFromOrderHandler = (uuid: string) => {
    removeProduct(uuid, { force: true });
  };
 */
  return (
    <Stack
      justifyContent="space-between"
      className={[
        styles["shopping-cart-drawer"],
        /* isEmpty ? styles["shopping-cart-drawer--empty"] : "", */
        anchor === "bottom" ? styles["shopping-cart-drawer--bottom"] : "",
      ].join(" ")}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        className={styles["shopping-cart-drawer__header"]}
      >
        {/* {!isEmpty && <Typography variant="h1">Ваш заказ</Typography>} */}
        <IconButton onClick={e => onClose(e, "backdropClick")} size="medium">
          <ArrowForwardIosIcon
            className={styles[`shopping-cart-drawer__back-btn--${anchor}`]}
          />
        </IconButton>
      </Stack>
      <Stack className={styles["shopping-cart-drawer__product-list"]}>
        {/* {orderedProducts.map(p => (
          <ProductCard
            {...p}
            key={p.orderedProductUUID}
            specifics={`${"30см"} / ${"720г"}`}
            onCountChanged={onCountChangedHandler}
            onRemove={onProductRemoveFromOrderHandler}
          />
        ))}
        {isEmpty && <EmptyStub />} */}
      </Stack>
      {/* {!isEmpty && (
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
            Итого: {totalPrice}
          </Typography>
          <Button variant="contained">
            <Typography variant="button">Оформить заказ</Typography>
          </Button>
        </Stack>
      )} */}
    </Stack>
  );
};

export default Popover;
