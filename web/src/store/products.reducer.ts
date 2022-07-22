import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import products from "~/public/products.json";

export interface Product {
  productUUID: string;
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
  reducers: {},
});

export default productsSlice.reducer;
