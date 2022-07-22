import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import products from "~/public/products.json";

export interface Product {
  uuid: string;
  article: string;
  name: string;
  desc?: string;
  imageURL: string;
  categoryUUID: string;
}

export interface ProductsState {
  value: Product[];
}

export const initialState: ProductsState = {
  value: products,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    add(state, action: PayloadAction<Product>) {
      state.value.push(action.payload);
    },
    remove(state, action: PayloadAction<Product>) {
      state.value = state.value.filter((p) => p.uuid === action.payload.uuid);
    },
  },
});

export const { add, remove } = productsSlice.actions;

export default productsSlice.reducer;
