import { IProductCategory } from "@monorepo/common";
import API from "./api.service";
import transformResponse, {
  APIData,
  APIPayload,
} from "./helpers/transform-response.helper";

export class ProductCategory implements IProductCategory {
  uuid: string;
  name: string;
  image_url: string;
  display_position?: number;
}

export const ProductCategoryAPI = API.injectEndpoints({
  endpoints: builder => ({
    getProductCategories: builder.query<
      APIData<ProductCategory[]>,
      APIPayload<void>
    >({
      query: () => `/products/-/categories`,
      transformResponse,
      providesTags: ["ProductCategory"],
    }),
    createProductCategory: builder.mutation<
      APIData<ProductCategory>,
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
    updateProductCategory: builder.mutation<
      APIData<ProductCategory>,
      APIPayload<ProductCategory>
    >({
      query: body => ({
        url: `/products/-/categories/${body.uuid}`,
        method: "PUT",
        body,
      }),
      transformResponse,
      invalidatesTags: ["ProductCategory"],
    }),
    deleteProductCategory: builder.mutation<
      APIData<void>,
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
  overrideExisting: false,
});

export const {
  useGetProductCategoriesQuery,
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} = ProductCategoryAPI;

export const { getProductCategories } = ProductCategoryAPI.endpoints;

export default ProductCategoryAPI;
