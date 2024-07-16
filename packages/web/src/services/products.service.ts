import {
  IProduct,
  IProductVolume,
  IProductWeight,
  ProductVolumeTypeEnum,
  ProductWeightTypeEnum,
} from "@monorepo/common";
import API from "./api.service";
import transformResponse, {
  APIData,
  APIPayload,
} from "./helpers/transform-response.helper";
import { Modifier } from "./modifiers.service";
import { ProductCategory } from "./product-categories.service";

export { ProductVolumeTypeEnum, ProductWeightTypeEnum };

export class ProductWeight implements IProductWeight {
  type: ProductWeightTypeEnum;
  value: number;
}

export class ProductVolume implements IProductVolume {
  type: ProductVolumeTypeEnum;
  value: number;
}

export class Product implements IProduct {
  uuid: string;
  name: string;
  desc?: string;
  article_number: number;
  image_url: string;
  weight?: ProductWeight;
  volume?: ProductVolume;
  price: number;
  display: boolean;
  categories: ProductCategory[];
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
        Omit<Product, "uuid" | "category" | "categories" | "modifiers"> & {
          categories_uuids: string[];
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
        Omit<Product, "category" | "categories" | "modifiers"> & {
          categories_uuids: string[];
          modifiers_uuids: string[];
        }
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
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = ProductAPI;

export const { getProducts } = ProductAPI.endpoints;

export default ProductAPI;
