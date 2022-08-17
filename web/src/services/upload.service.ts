import API from "./api.service";
import transformResponse, {
  APIData,
  APIPayload,
} from "./helpers/transform-response.helper";

export const IMAGE_FILE_SIZE = 200 * 1024; // 200 kb

export class Image {
  filename: string;
  url: string;
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
