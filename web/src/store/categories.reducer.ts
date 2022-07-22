import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import categories from "~/public/categories.json";

export interface ProductCategory {
  categoryUUID: string;
  name: string;
  imageURL: string;
}

export interface ProductCategoriesState {
  value: ProductCategory[];
  activeCategoryName: string | null;
}

export const initialState: ProductCategoriesState = {
  value: categories,
  activeCategoryName: null,
};

export const productCategoriesSlice = createSlice({
  name: "product-categories",
  initialState,
  reducers: {
    setActiveCategoryName(state, action: PayloadAction<string | null>) {
      state.activeCategoryName = action.payload;
    },
  },
});

export const { setActiveCategoryName } = productCategoriesSlice.actions;

export default productCategoriesSlice.reducer;
