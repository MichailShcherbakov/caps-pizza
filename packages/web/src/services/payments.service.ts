import { IPayment } from "@monorepo/common";
import API from "./api.service";
import transformResponse, {
  APIData,
  APIPayload,
} from "./helpers/transform-response.helper";

export class Payment implements IPayment {
  uuid: string;
  name: string;
  code: number;
}

export const PaymentsAPI = API.injectEndpoints({
  endpoints: builder => ({
    getPayments: builder.query<APIData<Payment[]>, APIPayload<void>>({
      query: () => `/payments`,
      transformResponse,
      providesTags: ["Payment"],
    }),
    createPayment: builder.mutation<
      APIData<Payment>,
      APIPayload<Omit<Payment, "uuid">>
    >({
      query: body => ({
        url: `/payments`,
        method: "POST",
        body,
      }),
      transformResponse,
      invalidatesTags: ["Payment"],
    }),
    updatePayment: builder.mutation<APIData<Payment>, APIPayload<Payment>>({
      query: body => ({
        url: `/payments/${body.uuid}`,
        method: "PUT",
        body,
      }),
      transformResponse,
      invalidatesTags: ["Payment"],
    }),
    deletePayment: builder.mutation<
      APIData<void>,
      APIPayload<{ uuid: string }>
    >({
      query: ({ uuid }) => ({
        url: `/payments/${uuid}`,
        method: "DELETE",
      }),
      transformResponse,
      invalidatesTags: ["Payment"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPaymentsQuery,
  useUpdatePaymentMutation,
  useCreatePaymentMutation,
  useDeletePaymentMutation,
} = PaymentsAPI;

export default PaymentsAPI;
