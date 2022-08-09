import API from "./api.service";
import transformResponse, {
  APIData,
  APIPayload,
} from "./helpers/transform-response.helper";
import { ModifierCategory } from "./modifier-categories.service";

export interface Modifier {
  uuid: string;
  name: string;
  desc?: string;
  article_number: number;
  image_url?: string;
  display_position?: number;
  price: number;
  category_uuid: string;
  category?: ModifierCategory;
}

export const ModifiersAPI = API.injectEndpoints({
  endpoints: builder => ({
    getModifiers: builder.query<APIData<Modifier[]>, APIPayload<void>>({
      query: () => `/modifiers`,
      transformResponse,
      providesTags: ["Modifier"],
    }),
    createModifier: builder.mutation<
      APIData<Modifier>,
      APIPayload<Omit<Modifier, "uuid">>
    >({
      query: body => ({
        url: `/modifiers`,
        method: "POST",
        body,
      }),
      transformResponse,
      invalidatesTags: ["Modifier"],
    }),
    updateModifier: builder.mutation<APIData<Modifier>, APIPayload<Modifier>>({
      query: body => ({
        url: `/modifiers/${body.uuid}`,
        method: "PUT",
        body,
      }),
      transformResponse,
      invalidatesTags: ["Modifier"],
    }),
    deleteModifier: builder.mutation<
      APIData<void>,
      APIPayload<{ uuid: string }>
    >({
      query: ({ uuid }) => ({
        url: `/modifiers/${uuid}`,
        method: "DELETE",
      }),
      transformResponse,
      invalidatesTags: ["Modifier"],
    }),
  }),
});

export const {
  useGetModifiersQuery,
  useCreateModifierMutation,
  useUpdateModifierMutation,
  useDeleteModifierMutation,
} = ModifiersAPI;

export default ModifiersAPI;
