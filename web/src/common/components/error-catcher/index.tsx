import { APIError } from "~/services/helpers/transform-response.helper";
import API_ERRORS, { ErrorInfo } from "./api-errors";

export interface ErrorCatcherProps {
  error?: APIError;
  children: (options: {
    errorInfo?: ErrorInfo;
    origin: APIError;
  }) => React.ReactElement;
}

export const ErrorCatcher: React.FC<ErrorCatcherProps> = ({
  error,
  children,
}) => {
  if (!error) return null;

  const apiError = API_ERRORS.find(
    e =>
      error.status === e.code &&
      (e.regex.test(error.data.message) || e.regex.test(error.message))
  );

  const regex =
    apiError?.regex.exec(error.message) ??
    apiError?.regex.exec(error.data.message);
  const matches = regex?.slice(1, regex?.length);

  return children({
    errorInfo: apiError
      ? {
          ...apiError,
          desc:
            typeof apiError.desc === "function"
              ? apiError.desc(matches)
              : apiError.desc,
        }
      : apiError,
    origin: error,
  });
};

export default ErrorCatcher;
