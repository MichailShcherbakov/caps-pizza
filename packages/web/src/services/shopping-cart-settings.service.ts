import API from "./api.service";
import transformResponse, {
  APIData,
  APIPayload,
} from "./helpers/transform-response.helper";
import { IShoppingCartSettings } from "@monorepo/common";

export const ShoppingCartSettingsAPI = API.injectEndpoints({
  endpoints: builder => ({
    getSettings: builder.query<
      APIData<IShoppingCartSettings>,
      APIPayload<void>
    >({
      query: () => `/shopping-cart-settings`,
      transformResponse,
      providesTags: ["ShoppingCartSettings"],
    }),
    setSettings: builder.mutation<
      APIData<IShoppingCartSettings>,
      APIPayload<Omit<IShoppingCartSettings, "uuid">>
    >({
      query: body => ({
        url: `/shopping-cart-settings`,
        method: "PUT",
        body,
      }),
      transformResponse,
      invalidatesTags: ["ShoppingCartSettings"],
    }),
  }),
  overrideExisting: false,
});

export const { getSettings } = ShoppingCartSettingsAPI.endpoints;

export const { useSetSettingsMutation, useGetSettingsQuery } =
  ShoppingCartSettingsAPI;

export default ShoppingCartSettingsAPI;
