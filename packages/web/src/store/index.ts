import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import API from "~/services/api.service";
import authReducer from "./auth.reducer";
import shoppingCartReducer from "./shopping-cart.reducer";
import { listenerMiddleware } from "./middleware";

export const createStore = () =>
  configureStore({
    reducer: {
      [API.reducerPath]: API.reducer,
      auth: authReducer,
      shoppingCart: shoppingCartReducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware()
        .concat(API.middleware)
        .prepend(listenerMiddleware.middleware),
  });

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(createStore, { debug: false });
