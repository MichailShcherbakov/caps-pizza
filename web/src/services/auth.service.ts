import API from "./api.service";
import transformResponse, {
  APIData,
  APIPayload,
} from "./helpers/transform-response.helper";

export interface SignInPayload {
  username: string;
  password: string;
}

export interface SignInResponse {
  access_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export const AuthAPI = API.injectEndpoints({
  endpoints: builder => ({
    signIn: builder.mutation<
      APIData<SignInResponse>,
      APIPayload<SignInPayload>
    >({
      query: body => ({
        url: `/auth/sign-in`,
        method: "POST",
        body,
      }),
      transformResponse,
    }),
    refreshToken: builder.mutation<
      APIData<RefreshTokenResponse>,
      APIPayload<void>
    >({
      query: body => ({
        url: `/auth/refresh-token`,
        method: "POST",
        body,
      }),
      transformResponse,
    }),
    getUsers: builder.query<APIData<any>, APIPayload<void>>({
      query: body => ({
        url: `/users`,
        method: "GET",
        body,
      }),
      transformResponse,
    }),
  }),
  overrideExisting: false,
});

export const { useSignInMutation, useRefreshTokenMutation, useGetUsersQuery } =
  AuthAPI;

export const { refreshToken } = AuthAPI.endpoints;

export default AuthAPI;
