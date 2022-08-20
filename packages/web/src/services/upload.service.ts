import API from "./api.service";
import transformResponse, {
  APIData,
  APIPayload,
} from "./helpers/transform-response.helper";
import { IImage } from "@monorepo/common";

export class Image implements IImage {
  filename: string;
  url: string;
  full_url: string;
}

export const UploadAPI = API.injectEndpoints({
  endpoints: builder => ({
    uploadImage: builder.mutation<APIData<Image>, APIPayload<FormData>>({
      query: body => ({
        url: `/upload`,
        method: "POST",
        header: {
          "Content-Type": "multipart/form-data",
        },
        body,
      }),
      transformResponse,
    }),
  }),
  overrideExisting: false,
});

export const { useUploadImageMutation } = UploadAPI;

export default UploadAPI;
