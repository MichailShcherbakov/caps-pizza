import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "./products.reducer";

export interface OrderedProduct extends Product {
  count: number;
}

export interface OrderState {
  products: OrderedProduct[];
}

export const initialState: OrderState = {
  products: [],
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      const existProduct = state.products.find(
        (p) => p.uuid === action.payload.uuid
      );
      if (existProduct) {
        state.products = state.products.map((p) => {
          if (p.uuid !== existProduct.uuid) return p;

          return {
            ...p,
            count: p.count + 1,
          };
        });

        return;
      }

      state.products.push({
        ...action.payload,
        count: 1,
      });
    },
    removeProduct(state, action: PayloadAction<string>) {
      const existProduct = state.products.find(
        (p) => p.uuid === action.payload
      );

      if (!existProduct) return;

      if (existProduct.count === 1) {
        state.products = state.products.filter(
          (p) => p.uuid !== action.payload
        );
        return;
      }

      state.products = state.products.map((p) => {
        if (p.uuid !== existProduct.uuid) return p;

        return {
          ...p,
          count: p.count - 1,
        };
      });
    },
  },
});

export const { addProduct, removeProduct } = orderSlice.actions;

export default orderSlice.reducer;
