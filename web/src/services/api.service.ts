import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";

export const API = createApi({
  reducerPath: "api",
  tagTypes: [
    "ModifierCategory",
    "Modifier",
    "ProductCategory",
    "Product",
    "Discount",
    "Delivery",
  ],
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: () => ({}),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
});

export default API;
