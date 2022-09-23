import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "~/services/orders.service";

export interface OrderCacheState {
  meta: {
    step?: "pending" | "rejected" | "fulfilled";
  };
  cache: Partial<Pick<Order, "delivery_address" | "client_info">>;
}

export const initialState: OrderCacheState = {
  meta: {},
  cache: {},
};

export const OrderCacheSlice = createSlice({
  name: "OrderCache",
  initialState,
  reducers: {
    write(state, action: PayloadAction<Pick<OrderCacheState, "cache">>) {
      state.cache = action.payload.cache;
    },
    setMetaStep(
      state,
      action: PayloadAction<{ step: "pending" | "rejected" | "fulfilled" }>
    ) {
      state.meta.step = action.payload.step;
    },
  },
});

export const { write, setMetaStep } = OrderCacheSlice.actions;

export default OrderCacheSlice.reducer;
