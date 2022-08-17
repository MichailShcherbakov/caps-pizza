import API from "./api.service";
import transformResponse, {
  APIData,
  APIPayload,
} from "./helpers/transform-response.helper";
import { Modifier } from "./modifiers.service";
import { ProductCategory } from "./product-categories.service";
import { Product } from "./products.service";

export enum DiscountTypeEnum {
  PERCENT = "PERCENT",
  IN_CASH = "IN_CASH",
  FIXED_PRICE = "FIXED_PRICE",
}

export enum DiscountCriteriaEnum {
  PRICE = "PRICE",
  COUNT = "COUNT",
}

export enum DiscountScopeEnum {
  PRODUCTS = "PRODUCTS",
  PRODUCT_FEATURES = "PRODUCT_FEATURES",
  GLOBAL = "GLOBAL",
}

export enum DiscountOperatorEnum {
  LESS = "LESS",
  GREATER = "GREATER",
  EQUAL = "EQUAL",
  BETWEEN = "BETWEEN",
}

export class DiscountСondition {
  criteria: DiscountCriteriaEnum;
  op: DiscountOperatorEnum;
  value: number;
  value2?: number;
}

export class Discount {
  uuid: string;
  name: string;
  type: DiscountTypeEnum;
  scope: DiscountScopeEnum;
  condition: DiscountСondition;
  value: number;
  products: Product[];
  product_categories: ProductCategory[];
  modifiers: Modifier[];
}

export type CreateDiscountPayload = Omit<
  Discount,
  "uuid" | "products" | "product_categories" | "modifiers"
> & {
  products_uuids: string[];
  product_categories_uuids: string[];
  modifiers_uuids: string[];
};

export type UpdateDiscountPayload = Omit<
  Discount,
  "products" | "product_categories" | "modifiers"
> & {
  products_uuids: string[];
  product_categories_uuids: string[];
  modifiers_uuids: string[];
};

export const DiscountAPI = API.injectEndpoints({
  endpoints: builder => ({
    getDiscounts: builder.query<APIData<Discount[]>, APIPayload<void>>({
      query: () => `/discounts`,
      transformResponse,
      providesTags: ["Discount"],
    }),
    createDiscount: builder.mutation<
      APIData<Discount>,
      APIPayload<CreateDiscountPayload>
    >({
      query: body => ({
        url: `/discounts`,
        method: "POST",
        body,
      }),
      transformResponse,
      invalidatesTags: ["Discount"],
    }),
    updateDiscount: builder.mutation<
      APIData<Discount>,
      APIPayload<UpdateDiscountPayload>
    >({
      query: body => ({
        url: `/discounts/${body.uuid}`,
        method: "PUT",
        body,
      }),
      transformResponse,
      invalidatesTags: ["Discount"],
    }),
    deleteDiscount: builder.mutation<
      APIData<void>,
      APIPayload<{ uuid: string }>
    >({
      query: ({ uuid }) => ({
        url: `/discounts/${uuid}`,
        method: "DELETE",
      }),
      transformResponse,
      invalidatesTags: ["Discount"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDiscountsQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
} = DiscountAPI;

export default DiscountAPI;
