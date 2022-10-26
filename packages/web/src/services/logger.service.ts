import getConfig from "next/config";
import API from "./api.service";
import transformResponse, {
  APIData,
  APIPayload,
} from "./helpers/transform-response.helper";

const { publicRuntimeConfig } = getConfig();

export const LoggerAPI = API.injectEndpoints({
  endpoints: builder => ({
    log: builder.mutation<APIData<void>, APIPayload<Record<string, any>>>({
      query: body => ({
        url: `/logger`,
        method: "POST",
        body,
      }),
      transformResponse,
      invalidatesTags: ["Logger"],
    }),
  }),
  overrideExisting: false,
});

export const { useLogMutation } = LoggerAPI;

export const log = async (data: Record<string, any>) => {
  return fetch(`${publicRuntimeConfig.API_URL}/logger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
    mode: "cors",
  });
};

export default LoggerAPI;
