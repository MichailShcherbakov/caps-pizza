import React from "react";
import { IconButton, Stack, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import useShoppingCart from "~/hooks/use-shopping-cart";

export interface ProductCardListHeaderProps {
  anchor?: "left" | "right" | "bottom" | "top";
  onExit?: () => void;
}

export const ProductCardListHeader: React.FC<ProductCardListHeaderProps> = ({
  anchor = "right",
  onExit,
}) => {
  const { products, isLoading } = useShoppingCart();

  const isEmpty = isLoading || !products.length;

  const onExitHandler = React.useCallback(() => {
    onExit && onExit();
  }, [onExit]);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      {!isEmpty && <Typography variant="h1">Ваш заказ</Typography>}
      <IconButton onClick={onExitHandler} size="medium">
        <ArrowForwardIosIcon
          sx={{
            transform: anchor === "bottom" ? "rotate(90deg)" : undefined,
          }}
        />
      </IconButton>
    </Stack>
  );
};

export default ProductCardListHeader;
