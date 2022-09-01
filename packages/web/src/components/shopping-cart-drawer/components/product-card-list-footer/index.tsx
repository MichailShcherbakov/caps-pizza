import { Button, Stack, Typography } from "@mui/material";
import useShoppingCart from "~/hooks/use-shopping-cart";

export interface ProductCardListFooterProps {
  onOrder?: () => void;
}

export const ProductCardListFooter: React.FC<ProductCardListFooterProps> = ({
  onOrder,
}) => {
  const { products, totalCost, discounts, isLoading } = useShoppingCart();

  if (isLoading || !products.length) return null;

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack>
        <Typography variant="h4" component="span">
          {`Итого: ${totalCost} ₽`}
        </Typography>
        {discounts.map(({ discount, discountValue }) => (
          <Typography key={discount.name} variant="subtitle1" component="span">
            {`Скидка: ${discount.name} - ${discountValue} ₽`}
          </Typography>
        ))}
      </Stack>
      <Button variant="outlined" onClick={onOrder}>
        Оформить заказ
      </Button>
    </Stack>
  );
};

export default ProductCardListFooter;
