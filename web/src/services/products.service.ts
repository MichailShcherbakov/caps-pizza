import API from "./api.service";
import transformResponse, {
  APIData,
  APIPayload,
} from "./helpers/transform-response.helper";
import { Modifier } from "./modifiers.service";
import { ProductCategory } from "./product-categories.service";

export class Product {
  uuid: string;
  name: string;
  desc?: string;
  article_number: number;
  image_url: string;
  price: number;
  category_uuid: string;
  category?: ProductCategory;
  modifiers: Modifier[];
}

export const ProductAPI = API.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query<APIData<Product[]>, APIPayload<void>>({
      query: () => `/products`,
      transformResponse,
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation<
      APIData<Product>,
      APIPayload<
        Omit<Product, "uuid" | "category" | "modifiers"> & {
          modifiers_uuids: string[];
        }
      >
    >({
      query: body => ({
        url: `/products`,
        method: "POST",
        body,
      }),
      transformResponse,
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<
      APIData<Product>,
      APIPayload<
        Omit<Product, "category" | "modifiers"> & { modifiers_uuids: string[] }
      >
    >({
      query: body => ({
        url: `/products/${body.uuid}`,
        method: "PUT",
        body,
      }),
      transformResponse,
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<
      APIData<void>,
      APIPayload<{ uuid: string }>
    >({
      query: ({ uuid }) => ({
        url: `/products/${uuid}`,
        method: "DELETE",
      }),
      transformResponse,
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = ProductAPI;

export default ProductAPI;