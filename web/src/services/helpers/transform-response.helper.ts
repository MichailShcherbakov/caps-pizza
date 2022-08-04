export interface APIError {
  error: string;
  message: string;
}

export function transformResponse<T>(response: {
  data?: T;
  error?: string;
  message?: string;
}) {
  return (
    (response.data as T) ??
    ({ error: response.error, message: response.message } as APIError)
  );
}

export default transformResponse;
