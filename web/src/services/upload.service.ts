import API from "./api.service";
import transformResponse, {
  APIData,
  APIError,
  APIPayload,
} from "./helpers/transform-response.helper";

export interface Image {
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
});

export const { useUploadImageMutation } = UploadAPI;

export default UploadAPI;
