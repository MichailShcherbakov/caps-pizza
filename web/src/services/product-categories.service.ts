import API from "./api.service";
import transformResponse, {
  APIData,
  APIError,
  APIPayload,
} from "./helpers/transform-response.helper";

export interface ProductCategory {
  uuid: string;
  name: string;
  image_url: string;
}

export const ProductCategoryAPI = API.injectEndpoints({
  endpoints: builder => ({
    getProductCategories: builder.query<
      APIData<ProductCategory[]> | APIError,
      APIPayload<void>
    >({
      query: () => `/products/-/categories`,
      transformResponse,
      providesTags: ["ProductCategory"],
    }),
    createProductCategory: builder.mutation<
      APIData<ProductCategory> | APIError,
      APIPayload<Omit<ProductCategory, "uuid">>
    >({
      query: body => ({
        url: `/products/-/categories`,
        method: "POST",
        body,
      }),
      transformResponse,
      invalidatesTags: ["ProductCategory"],
    }),
    deleteProductCategory: builder.mutation<
      APIData<void> | APIError,
      APIPayload<{ uuid: string }>
    >({
      query: ({ uuid }) => ({
        url: `/products/-/categories/${uuid}`,
        method: "DELETE",
      }),
      transformResponse,
      invalidatesTags: ["ProductCategory"],
    }),
  }),
});

export const {
  useGetProductCategoriesQuery,
  useCreateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} = ProductCategoryAPI;

export default ProductCategoryAPI;
