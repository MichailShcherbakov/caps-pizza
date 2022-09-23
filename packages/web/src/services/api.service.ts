import getConfig from "next/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";
import { RootState } from "~/store";
import { setAccessToken } from "~/store/reducers/auth.reducer";
import { RefreshTokenResponse } from "./auth.service";

const { publicRuntimeConfig } = getConfig();

const baseQuery = fetchBaseQuery({
  baseUrl: publicRuntimeConfig.API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) headers.set("Authorization", `Bearer ${token}`);

    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const { data } = refreshResult.data as { data: RefreshTokenResponse };

      api.dispatch(
        setAccessToken({
          token: data.access_token,
        })
      );
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const API = createApi({
  reducerPath: "api",
  tagTypes: [
    "ModifierCategory",
    "Modifier",
    "ProductCategory",
    "Product",
    "Discount",
    "Delivery",
    "Payment",
    "Promotion",
  ],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
});

export const {
  util: { getRunningOperationPromises },
} = API;

export default API;
