import {
  IDelivery,
  DeliveryCriteriaEnum,
  DeliveryOperatorEnum,
  DeliveryTypeEnum,
  IDeliveryСondition,
} from "@monorepo/common";
import API from "./api.service";
import transformResponse, {
  APIData,
  APIPayload,
} from "./helpers/transform-response.helper";

export { DeliveryCriteriaEnum, DeliveryOperatorEnum, DeliveryTypeEnum };

export class DeliveryСondition implements IDeliveryСondition {
  criteria: DeliveryCriteriaEnum;
  op: DeliveryOperatorEnum;
  value: number;
  value2?: number;
}

export class Delivery implements IDelivery {
  uuid: string;
  name: string;
  article_number: number;
  type: DeliveryTypeEnum;
  condition: DeliveryСondition;
  value: number;
}

export type CreateDeliveryPayload = Omit<Delivery, "uuid">;

export type UpdateDeliveryPayload = Delivery;

export const DeliveryAPI = API.injectEndpoints({
  endpoints: builder => ({
    getDeliveries: builder.query<APIData<Delivery[]>, APIPayload<void>>({
      query: () => `/deliveries`,
      transformResponse,
      providesTags: ["Delivery"],
    }),
    createDelivery: builder.mutation<
      APIData<Delivery>,
      APIPayload<CreateDeliveryPayload>
    >({
      query: body => ({
        url: `/deliveries`,
        method: "POST",
        body,
      }),
      transformResponse,
      invalidatesTags: ["Delivery"],
    }),
    updateDelivery: builder.mutation<
      APIData<Delivery>,
      APIPayload<UpdateDeliveryPayload>
    >({
      query: body => ({
        url: `/deliveries/${body.uuid}`,
        method: "PUT",
        body,
      }),
      transformResponse,
      invalidatesTags: ["Delivery"],
    }),
    deleteDelivery: builder.mutation<
      APIData<void>,
      APIPayload<{ uuid: string }>
    >({
      query: ({ uuid }) => ({
        url: `/deliveries/${uuid}`,
        method: "DELETE",
      }),
      transformResponse,
      invalidatesTags: ["Delivery"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDeliveriesQuery,
  useCreateDeliveryMutation,
  useUpdateDeliveryMutation,
  useDeleteDeliveryMutation,
} = DeliveryAPI;

export default DeliveryAPI;
