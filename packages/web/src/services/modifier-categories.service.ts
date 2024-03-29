import {
  IModifierCategory,
  ModifierCategoryChoiceOptionEnum,
  ModifierCategoryDisplayVariantEnum,
} from "@monorepo/common";
import API from "./api.service";
import transformResponse, {
  APIData,
  APIPayload,
} from "./helpers/transform-response.helper";

export class ModifierCategory implements IModifierCategory {
  uuid: string;
  name: string;
  image_url?: string;
  choice_option: ModifierCategoryChoiceOptionEnum;
  display: boolean;
  display_name?: string;
  display_variant: ModifierCategoryDisplayVariantEnum;
  display_position?: number;
}

export const ModifierCategoryAPI = API.injectEndpoints({
  endpoints: builder => ({
    getModifierCategories: builder.query<
      APIData<ModifierCategory[]>,
      APIPayload<void>
    >({
      query: () => `/modifiers/-/categories`,
      transformResponse,
      providesTags: ["ModifierCategory"],
    }),
    createModifierCategory: builder.mutation<
      APIData<ModifierCategory>,
      APIPayload<Omit<ModifierCategory, "uuid">>
    >({
      query: body => ({
        url: `/modifiers/-/categories`,
        method: "POST",
        body,
      }),
      transformResponse,
      invalidatesTags: ["ModifierCategory"],
    }),
    updateModifierCategory: builder.mutation<
      APIData<ModifierCategory>,
      APIPayload<ModifierCategory>
    >({
      query: body => ({
        url: `/modifiers/-/categories/${body.uuid}`,
        method: "PUT",
        body,
      }),
      transformResponse,
      invalidatesTags: ["ModifierCategory"],
    }),
    deleteModifierCategory: builder.mutation<
      APIData<void>,
      APIPayload<{ uuid: string }>
    >({
      query: ({ uuid }) => ({
        url: `/modifiers/-/categories/${uuid}`,
        method: "DELETE",
      }),
      transformResponse,
      invalidatesTags: ["ModifierCategory"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetModifierCategoriesQuery,
  useUpdateModifierCategoryMutation,
  useCreateModifierCategoryMutation,
  useDeleteModifierCategoryMutation,
} = ModifierCategoryAPI;

export default ModifierCategoryAPI;
