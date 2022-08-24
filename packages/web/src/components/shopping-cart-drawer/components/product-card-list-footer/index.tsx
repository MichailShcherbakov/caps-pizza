import { Button, Stack, Typography } from "@mui/material";
import useShoppingCart from "~/hooks/use-shopping-cart";

export interface ProductCardListFooterProps {
  onOrder?: () => void;
}

export const ProductCardListFooter: React.FC<ProductCardListFooterProps> = ({
  onOrder,
}) => {
  const { products, totalCost, discount, discountValue, isLoading } =
    useShoppingCart();

  if (isLoading || !products.length) return null;

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack>
        <Typography variant="h4" component="span">
          {`Итого: ${totalCost} ₽`}
        </Typography>
        {discount ? (
          <Typography variant="subtitle1" component="span">
            {`Скидка: ${discount.name} - ${discountValue} ₽`}
          </Typography>
        ) : undefined}
      </Stack>
      <Button variant="outlined" onClick={onOrder}>
        <Typography variant="button">Оформить заказ</Typography>
      </Button>
    </Stack>
  );
};

export default ProductCardListFooter;
