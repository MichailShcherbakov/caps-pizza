export type APIData<T> = T | undefined;

export type APIError = {
  status: number;
  data: {
    statusCode: number;
    error: string;
    message: string;
  };
};

export type APIResult = {
  error?: APIError;
};

export type APIPayload<T> = T;

export function transformResponse<T>(response: { data?: T }): T | undefined {
  return response.data;
}

export default transformResponse;
