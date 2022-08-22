import React from "react";
import useShoppingCartActions from "~/hooks/use-shopping-cart-actions";

export interface ShoppingCartProps {
  children?: React.ReactElement | React.ReactElement[] | null;
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({ children }) => {
  const { loadFromStorage } = useShoppingCartActions();

  React.useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return <>{children}</>;
};

export default ShoppingCart;
