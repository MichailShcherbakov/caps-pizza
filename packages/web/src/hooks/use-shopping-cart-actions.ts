import React from "react";
import { useAppDispatch } from "~/store/hooks";
import {
  addProduct,
  removeProduct,
  OrderedProduct,
  setMetaStep,
} from "~/store/shopping-cart.reducer";

export const SHOPPING_CART_STORAGE_KEY = "shopping-cart-storage";

export const useShoppingCartActions = () => {
  const dispatch = useAppDispatch();

  return React.useMemo(
    () => ({
      loadFromStorage: () => {
        dispatch(setMetaStep({ step: "pending" }));
      },
      addProduct: (product: Omit<OrderedProduct, "count">) => {
        dispatch(addProduct(product));
      },
      removeProduct: (
        product: Omit<OrderedProduct, "count">,
        force = false
      ) => {
        dispatch(removeProduct({ product, force }));
      },
    }),
    [dispatch]
  );
};

export default useShoppingCartActions;
