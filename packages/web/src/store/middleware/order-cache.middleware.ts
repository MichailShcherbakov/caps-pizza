import { createListenerMiddleware } from "@reduxjs/toolkit";
import { RootState } from "..";
import {
  write,
  setMetaStep,
  OrderCacheState,
} from "../reducers/order-cache.reducer";

const { middleware, startListening } = createListenerMiddleware();

export const OrderCacheMiddleware = middleware;

export const ORDER_CACHE_STORAGE_KEY = "order-cache-storage";

startListening({
  actionCreator: write,
  effect: (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;

    localStorage.setItem(
      ORDER_CACHE_STORAGE_KEY,
      JSON.stringify({ cache: state.orderCache.cache })
    );
  },
});

startListening({
  actionCreator: setMetaStep,
  effect: (action, listenerApi) => {
    if (action.payload.step === "pending") {
      const data = localStorage.getItem(ORDER_CACHE_STORAGE_KEY);

      if (!data) {
        listenerApi.dispatch(
          setMetaStep({
            step: "fulfilled",
          })
        );
        return;
      }

      const loadedData: Partial<Pick<OrderCacheState, "cache">> =
        JSON.parse(data);

      listenerApi.dispatch(
        write({
          cache: loadedData?.cache ?? {},
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

export default OrderCacheMiddleware;
