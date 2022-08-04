import API from "./api.service";
import transformResponse, {
  APIError,
} from "./helpers/transform-response.helper";

export interface ModifierCategory {
  uuid: string;
  name: string;
  image_url?: string;
}

export const ModifierCategoryAPI = API.injectEndpoints({
  endpoints: builder => ({
    getModifierCategories: builder.query<ModifierCategory[] | APIError, void>({
      query: () => `/modifiers/categories`,
      transformResponse,
      providesTags: result =>
        Array.isArray(result)
          ? result.map(({ uuid }) => ({ type: "ModifierCategory", id: uuid }))
          : ["ModifierCategory"],
    }),
    createModifierCategory: builder.mutation<
      ModifierCategory | APIError,
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
} = ModifierCategoryAPI;

export default ModifierCategoryAPI;
