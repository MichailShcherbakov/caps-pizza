export type APIError = {
  error: string;
  message: string;
};

export type APIData<T> = T;

export type APIPayload<T> = T;

export function transformResponse<T>(response: {
  data?: T;
  error?: string;
  message?: string;
}): APIData<T> | APIError {
  return response.error && response.message
    ? { error: response.error, message: response.message }
    : (response.data as T);
}

export default transformResponse;
