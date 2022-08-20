import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "./hooks";

export interface OrderedModifier {
  uuid: string;
  price: number;
}

export interface OrderedProduct {
  uuid: string;
  price: number;
  count: number;
  modifiers: OrderedModifier[];
}

export interface ShoppingCartState {
  products: OrderedProduct[];
  totalCost: number;
}

export const initialState: ShoppingCartState = {
  products: [],
  totalCost: 0,
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
        product => product.uuid === action.payload.uuid
      );

      state.totalCost +=
        action.payload.price +
        action.payload.modifiers.reduce(
          (price, modifier) => price + modifier.price,
          0
        );

      if (
        foundProduct &&
        compareModifiers(foundProduct.modifiers, action.payload.modifiers)
      ) {
        foundProduct.count++;
        return;
      }

      state.products.push({ ...action.payload, count: 1 });
    },
    removeProduct(state, action: PayloadAction<{ uuid: string }>) {
      const foundProduct = state.products.find(
        product => product.uuid === action.payload.uuid
      );

      if (!foundProduct) return;

      state.totalCost -=
        foundProduct.price +
        foundProduct.modifiers.reduce(
          (price, modifier) => price + modifier.price,
          0
        );

      if (foundProduct.count - 1 === 0) {
        state.products.filter(product => product.uuid !== action.payload.uuid);
        return;
      }

      foundProduct.count--;
    },
  },
});

export const { addProduct, removeProduct } = shoppingCartSlice.actions;

export const useShoppingCart = () => {
  const dispatch = useAppDispatch();
  const { products, totalCost } = useAppSelector(store => ({
    products: store.shoppingCart.products ?? new Map<string, OrderedProduct>(),
    totalCost: store.shoppingCart.totalCost,
  }));

  return {
    products,
    totalCost,
    addProduct: (product: Omit<OrderedProduct, "count">) =>
      dispatch(addProduct(product)),
    removeProduct: (uuid: string) => dispatch(removeProduct({ uuid })),
  };
};

export default shoppingCartSlice.reducer;
