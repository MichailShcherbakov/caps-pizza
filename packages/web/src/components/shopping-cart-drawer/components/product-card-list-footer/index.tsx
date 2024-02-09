import { Button, Stack, Tooltip, Typography } from "@mui/material";
import useShoppingCart from "~/hooks/use-shopping-cart";
import { useGetSettingsQuery } from "~/services/shopping-cart-settings.service";

export interface ProductCardListFooterProps {
  onOrder?: () => void;
}

export const ProductCardListFooter: React.FC<ProductCardListFooterProps> = ({
  onOrder,
}) => {
  const { products, totalCost, totalOrderCost, discounts, isLoading } =
    useShoppingCart();
  const { data: settings, isLoading: isGetSettingLoading } =
    useGetSettingsQuery();

  if (isLoading || isGetSettingLoading || !products.length) return null;

  const minimumOrderAmount = settings?.minimum_order_amount ?? 0;
  const canMakeOrder = totalOrderCost >= minimumOrderAmount;

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
      <Stack direction="column">
        <Tooltip
          disableInteractive
          disableFocusListener={canMakeOrder}
          disableHoverListener={canMakeOrder}
          disableTouchListener={canMakeOrder}
          title={`Минимальна сумма заказа от ${minimumOrderAmount} ₽`}
        >
          <span>
            <Button
              variant="outlined"
              onClick={onOrder}
              disabled={!canMakeOrder}
            >
              Оформить заказ
            </Button>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default ProductCardListFooter;
