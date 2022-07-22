import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import productCategoriesReducer from "./categories.reducer";
import configReducer from "./config.reducer";
import orderReducer from "./order.reducer";
import productsReducer from "./products.reducer";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: productCategoriesReducer,
    order: orderReducer,
    config: configReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const wrapper = createWrapper(() => store, { debug: true });
