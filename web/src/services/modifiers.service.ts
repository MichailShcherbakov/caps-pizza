import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { ApiError } from "next/dist/server/api-utils";
import API from "./api.service";
import transformResponse, {
  APIError,
} from "./helpers/transform-response.helper";
import {
  ModifierCategory,
  useGetModifierCategoriesQuery,
} from "./modifier-categories.service";

export interface Modifier {
  uuid: string;
  name: string;
  desc?: string;
  article_number: number;
  image_url?: string;
  price: number;
  category_uuid: string;
  category?: ModifierCategory;
}

export const useGetModifiersQuery = (): {
  data: Modifier[];
  error?: FetchBaseQueryError | SerializedError | ApiError;
  isLoading: boolean;
  isError: boolean;
} => {
  const modifierCategoriesQuery = useGetModifierCategoriesQuery();
  const modifiersQuery = ModifiersAPI.useGetModifiersQuery();

  if (
    modifierCategoriesQuery.isLoading ||
    modifierCategoriesQuery.isError ||
    modifiersQuery.isLoading ||
    modifiersQuery.isError
  )
    return {
      data: [],
      error:
        modifiersQuery.isError || modifierCategoriesQuery.isError
          ? modifiersQuery.error ?? modifierCategoriesQuery.error
          : undefined,
      isLoading: modifiersQuery.isLoading || modifierCategoriesQuery.isLoading,
      isError: modifiersQuery.isError || modifierCategoriesQuery.isError,
    };

  const { data: modifiersOrError = [] } = modifiersQuery;
  const { data: modifierCategoriesOrError = [] } = modifierCategoriesQuery;

  if (!Array.isArray(modifiersOrError))
    return {
      data: [],
      error: modifiersOrError,
      isError: true,
      isLoading: false,
    };

  if (!Array.isArray(modifierCategoriesOrError))
    return {
      data: [],
      error: modifierCategoriesOrError,
      isError: true,
      isLoading: false,
    };

  const modifiers = modifiersOrError;
  const modifierCategories = modifierCategoriesOrError;

  return {
    data: modifiers.map(p => ({
      ...p,
      category: modifierCategories.find(c => c.uuid === p.category_uuid),
    })),
    isLoading: false,
    isError: false,
  };
};

export const ModifiersAPI = API.injectEndpoints({
  endpoints: builder => ({
    getModifiers: builder.query<Modifier[] | APIError, void>({
      query: () => `/modifiers`,
      transformResponse,
      providesTags: result =>
        Array.isArray(result)
          ? result.map(({ uuid }) => ({ type: "Modifier", id: uuid }))
          : ["Modifier"],
    }),
    createModifier: builder.mutation<
      Modifier | APIError,
      Omit<Modifier, "uuid">
    >({
      query: body => ({
        url: `/modifiers`,
        method: "POST",
        body,
      }),
      transformResponse,
      invalidatesTags: ["Modifier"],
    }),
    deleteModifier: builder.mutation<void | APIError, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `/modifiers/${uuid}`,
        method: "DELETE",
      }),
      transformResponse,
      invalidatesTags: ["Modifier"],
    }),
  }),
});

export const { useCreateModifierMutation, useDeleteModifierMutation } =
  ModifiersAPI;

export default ModifiersAPI;
