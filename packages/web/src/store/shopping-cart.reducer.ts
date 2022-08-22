import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrderedModifier {
  uuid: string;
}

export interface OrderedProduct {
  uuid: string;
  count: number;
  modifiers: OrderedModifier[];
}

export interface ShoppingCartState {
  products: OrderedProduct[];
}

export const initialState: ShoppingCartState = {
  products: [],
};

export const compareModifiers = (
  a: OrderedModifier[],
  b: OrderedModifier[]
) => {
  if (a.length !== b.length) return false;

  return a.every((v, i) => v.uuid === b[i].uuid);
};

export const shoppingCartSlice = createSlice({
  name: "shippingCart",
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Omit<OrderedProduct, "count">>) {
      const foundProduct = state.products.find(
        product =>
          product.uuid === action.payload.uuid &&
          compareModifiers(product.modifiers, action.payload.modifiers)
      );

      if (foundProduct) {
        foundProduct.count++;
        return;
      }

      state.products.push({ ...action.payload, count: 1 });
    },
    removeProduct(
      state,
      action: PayloadAction<{
        product: Omit<OrderedProduct, "count">;
        force: boolean;
      }>
    ) {
      const foundProductIndex = state.products.findIndex(
        product =>
          product.uuid === action.payload.product.uuid &&
          compareModifiers(product.modifiers, action.payload.product.modifiers)
      );

      if (foundProductIndex === -1) return;

      const foundProduct = state.products[foundProductIndex];

      if (action.payload.force || foundProduct.count - 1 === 0) {
        state.products.splice(foundProductIndex, 1);
        return;
      }

      foundProduct.count--;
    },
  },
});

export const { addProduct, removeProduct } = shoppingCartSlice.actions;

export default shoppingCartSlice.reducer;
