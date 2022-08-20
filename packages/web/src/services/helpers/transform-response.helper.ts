export type APIData<T> = T | undefined;

export class APIError extends Error {
  status: number;

  constructor(
    public readonly data: { statusCode: number; error: string; message: string }
  ) {
    super(data.message);

    this.status = data.statusCode;
  }
}

export type APIResult = {
  error?: APIError;
};

export type APIPayload<T> = T;

export function transformResponse<T>(response: { data?: T }): T | undefined {
  return response.data;
}

export default transformResponse;
