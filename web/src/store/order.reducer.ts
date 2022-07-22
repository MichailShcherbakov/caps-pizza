import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { Product } from "./products.reducer";

export interface OrderedProduct {
  orderedProductUUID: string;
  productUUID: string;
  count: number;
  price: number;
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
    addProduct(state, action: PayloadAction<OrderedProduct>) {
      state.products.push(action.payload);
    },
    removeProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter(
        (p) => p.orderedProductUUID !== action.payload
      );
    },
    updateProduct(
      state,
      action: PayloadAction<
        Partial<OrderedProduct> & Pick<OrderedProduct, "orderedProductUUID">
      >
    ) {
      state.products = state.products.map((p) => {
        if (p.orderedProductUUID !== action.payload.orderedProductUUID)
          return p;

        return {
          ...p,
          ...action.payload,
        };
      });
    },
  },
});

export const selectOrderedProducts = (state: RootState) => {
  const orderedProducts: (OrderedProduct & Product)[] = [];

  for (const product of state.products.value) {
    const orderedProduct = state.order.products.find(
      (p) => product.productUUID === p.productUUID
    );

    if (!orderedProduct) continue;

    orderedProducts.push({
      ...product,
      ...orderedProduct,
    });
  }

  return orderedProducts;
};

export const selectCountOrderedProducts = (state: RootState) => {
  return state.order.products.reduce((sum, p) => (sum += p.count), 0);
};

export const selectTotalOrderPrice = (state: RootState) => {
  return state.order.products.reduce((sum, p) => (sum += p.price * p.count), 0);
};

export const { addProduct, removeProduct, updateProduct } = orderSlice.actions;

export default orderSlice.reducer;
