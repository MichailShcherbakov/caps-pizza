import React from "react";
import { useAppDispatch } from "~/store/hooks";
import {
  addProduct,
  OrderedProduct,
  removeProduct,
} from "~/store/shopping-cart.reducer";

export const useShoppingCartActions = () => {
  const dispatch = useAppDispatch();

  return React.useMemo(
    () => ({
      addProduct: (product: Omit<OrderedProduct, "count">) =>
        dispatch(addProduct(product)),
      removeProduct: (product: Omit<OrderedProduct, "count">, force = false) =>
        dispatch(removeProduct({ product, force })),
    }),
    [dispatch]
  );
};

export default useShoppingCartActions;
