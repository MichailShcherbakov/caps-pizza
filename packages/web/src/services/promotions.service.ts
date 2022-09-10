import { IPromotion } from "@monorepo/common";
import API from "./api.service";
import transformResponse, {
  APIData,
  APIPayload,
} from "./helpers/transform-response.helper";

export class Promotion implements IPromotion {
  uuid: string;
  name: string;
  image_url: string;
  display: boolean;
  display_position: number;
}

export type CreatePromotionPayload = Omit<Promotion, "uuid">;
export type UpdatePromotionPayload = Promotion;

export const PromotionAPI = API.injectEndpoints({
  endpoints: builder => ({
    getPromotions: builder.query<APIData<Promotion[]>, APIPayload<void>>({
      query: () => `/promotions`,
      transformResponse,
      providesTags: ["Promotion"],
    }),
    createPromotion: builder.mutation<
      APIData<Promotion>,
      APIPayload<CreatePromotionPayload>
    >({
      query: body => ({
        url: `/promotions`,
        method: "POST",
        body,
      }),
      transformResponse,
      invalidatesTags: ["Promotion"],
    }),
    updatePromotion: builder.mutation<
      APIData<Promotion>,
      APIPayload<UpdatePromotionPayload>
    >({
      query: body => ({
        url: `/promotions/${body.uuid}`,
        method: "PUT",
        body,
      }),
      transformResponse,
      invalidatesTags: ["Promotion"],
    }),
    deletePromotion: builder.mutation<
      APIData<void>,
      APIPayload<{ uuid: string }>
    >({
      query: ({ uuid }) => ({
        url: `/promotions/${uuid}`,
        method: "DELETE",
      }),
      transformResponse,
      invalidatesTags: ["Promotion"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} = PromotionAPI;

export default PromotionAPI;
