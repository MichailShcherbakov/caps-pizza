import React from "react";
import { APIError } from "~/services/helpers/transform-response.helper";

export type ErrorHandlerContextType = {
  error?: APIError;
  children?: React.ReactElement | React.ReactElement[];
};

export const initialContext: ErrorHandlerContextType = {};

export const ErrorHandlerContext =
  React.createContext<ErrorHandlerContextType>(initialContext);

export interface ErrorHandlerProps extends ErrorHandlerContextType {}

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({
  error,
  children,
}) => {
  return (
    <ErrorHandlerContext.Provider value={{ error }}>
      {error ? children : undefined}
    </ErrorHandlerContext.Provider>
  );
};

export interface APIErrorHandleProps {
  status: number;
  message?: RegExp;
  children: React.ReactElement;
}

export const APIErrorHandle: React.FC<APIErrorHandleProps> = ({
  status,
  message,
  children,
}) => {
  const { error } =
    React.useContext<ErrorHandlerContextType>(ErrorHandlerContext);

  if (
    error &&
    error.status === status &&
    (!message || message.test(error.data.message))
  )
    return children;

  return null;
};

export default ErrorHandler;
