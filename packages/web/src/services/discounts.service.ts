import {
  IDiscount,
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
  IDiscountCondition,
  IDiscountStrategy,
} from "@monorepo/common";
import API from "./api.service";
import transformResponse, {
  APIData,
  APIPayload,
} from "./helpers/transform-response.helper";
import { Modifier } from "./modifiers.service";
import { ProductCategory } from "./product-categories.service";
import { Product } from "./products.service";

export { DiscountCriteriaEnum, DiscountOperatorEnum, DiscountTypeEnum };

export class DiscountCondition implements IDiscountCondition {
  criteria: DiscountCriteriaEnum;
  op: DiscountOperatorEnum;
  value: number;
  value2?: number;
}

export class DiscountStrategy implements IDiscountStrategy {
  condition: DiscountCondition;
  products: Product[];
  product_categories: ProductCategory[];
  modifiers: Modifier[];
}

export class Discount implements IDiscount {
  uuid: string;
  name: string;
  type: DiscountTypeEnum;
  value: number;
  strategies: DiscountStrategy[];
}

export type CreateDiscountPayload = Omit<Discount, "uuid" | "strategies"> & {
  strategies: {
    condition: DiscountCondition;
    products_uuids: string[];
    product_categories_uuids: string[];
    modifiers_uuids: string[];
  }[];
};

export type UpdateDiscountPayload = CreateDiscountPayload & {
  uuid: string;
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
