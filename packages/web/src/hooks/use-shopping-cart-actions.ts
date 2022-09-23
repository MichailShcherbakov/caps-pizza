import React from "react";
import { useAppDispatch } from "~/store/hooks";
import {
  addProduct,
  removeProduct,
  OrderedProduct,
  setMetaStep,
  clear,
} from "~/store/reducers/shopping-cart.reducer";

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
      clear: () => {
        dispatch(clear());
      },
    }),
    [dispatch]
  );
};

export default useShoppingCartActions;
