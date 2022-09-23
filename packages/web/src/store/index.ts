import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import API from "~/services/api.service";
import authReducer from "./reducers/auth.reducer";
import shoppingCartReducer from "./reducers/shopping-cart.reducer";
import ShoppingCartMiddleware from "./middleware/shopping-cart.middleware";
import orderCacheReducer from "./reducers/order-cache.reducer";
import OrderCacheMiddleware from "./middleware/order-cache.middleware";

export const createStore = () =>
  configureStore({
    reducer: {
      [API.reducerPath]: API.reducer,
      auth: authReducer,
      shoppingCart: shoppingCartReducer,
      orderCache: orderCacheReducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware()
        .concat(API.middleware)
        .prepend(ShoppingCartMiddleware)
        .prepend(OrderCacheMiddleware),
  });

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(createStore, { debug: false });
