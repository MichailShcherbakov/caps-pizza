import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from ".";
import {
  addProduct,
  clear,
  init,
  removeProduct,
  setMetaStep,
} from "./shopping-cart.reducer";

export const SHOPPING_CART_STORAGE_KEY = "shopping-cart-storage";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(addProduct, removeProduct),
  effect: (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;

    localStorage.setItem(
      SHOPPING_CART_STORAGE_KEY,
      JSON.stringify({
        products: state.shoppingCart.products,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: setMetaStep,
  effect: (action, listenerApi) => {
    if (action.payload.step === "pending") {
      const data = localStorage.getItem(SHOPPING_CART_STORAGE_KEY);

      if (!data) {
        listenerApi.dispatch(
          setMetaStep({
            step: "fulfilled",
          })
        );
        return;
      }

      const { products } = JSON.parse(data);

      listenerApi.dispatch(
        init({
          products,
        })
      );

      listenerApi.dispatch(
        setMetaStep({
          step: "fulfilled",
        })
      );
    }
  },
});

listenerMiddleware.startListening({
  actionCreator: clear,
  effect: () => {
    localStorage.removeItem(SHOPPING_CART_STORAGE_KEY);
  },
});
