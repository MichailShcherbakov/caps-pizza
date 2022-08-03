import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ModifierCategory {
  uuid: string;
  name: string;
  image_url?: string;
}

export interface Modifier {
  uuid: string;
  name: string;
  desc?: string;
  article_number: number;
  image_url?: string;
  price: number;
  category_uuid: string;
}

export interface APIError {
  error: string;
  message: string;
}

export function transformResponse<T>(response: {
  data?: T;
  error?: string;
  message?: string;
}) {
  return (
    (response.data as T) ??
    ({ error: response.error, message: response.message } as APIError)
  );
}

export const API = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  tagTypes: ["ModifierCategory"],
  endpoints: builder => ({
    getModifierCategories: builder.query<Modifier[] | APIError, void>({
      query: () => `/modifiers/categories`,
      transformResponse,
      providesTags: result =>
        Array.isArray(result)
          ? result.map(({ uuid }) => ({ type: "ModifierCategory", id: uuid }))
          : ["ModifierCategory"],
    }),
    createModifierCategory: builder.mutation<
      Modifier | APIError,
      Omit<ModifierCategory, "uuid">
    >({
      query: body => ({
        url: `/modifiers/categories`,
        method: "POST",
        body,
      }),
      transformResponse,
      invalidatesTags: ["ModifierCategory"],
    }),
    deleteModifierCategory: builder.mutation<void | APIError, { uuid: string }>(
      {
        query: ({ uuid }) => ({
          url: `/modifiers/categories/${uuid}`,
          method: "DELETE",
        }),
        transformResponse,
        invalidatesTags: ["ModifierCategory"],
      }
    ),
  }),
});

export const {
  useGetModifierCategoriesQuery,
  useCreateModifierCategoryMutation,
  useDeleteModifierCategoryMutation,
} = API;

export default API;
