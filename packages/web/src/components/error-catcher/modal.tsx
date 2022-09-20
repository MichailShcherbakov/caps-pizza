import React from "react";
import ErrorCatcher, { ErrorCatcherProps } from ".";
import { ModalOverview, NotificationModal } from "~/ui";
import OhNoNotificationModal from "../notifications/modals/oh-no.notification";
import { APIError } from "~/services/helpers/transform-response.helper";
import getConfig from "next/config";

const {
  publicRuntimeConfig: { __DEV__ },
} = getConfig();

export const ModalErrorCatcher: React.FC<
  Pick<ErrorCatcherProps, "error">
> = props => {
  const [error, setError] = React.useState<APIError>();

  React.useEffect(() => {
    setError(props.error);
  }, [props.error]);

  return (
    <ErrorCatcher error={error}>
      {({ errorInfo, origin }) => {
        if (!errorInfo) {
          if (__DEV__) {
            return (
              <ModalOverview
                Modal={NotificationModal}
                ModalProps={{
                  title: origin.data?.error ?? "Unknown error",
                  desc: origin.data?.message ?? origin.message,
                  variant: "error",
                  onAccept: () => {
                    setError(undefined);
                  },
                }}
              />
            );
          }

          return (
            <ModalOverview
              Modal={OhNoNotificationModal}
              ModalProps={{
                onAccept: () => {
                  setError(undefined);
                },
              }}
            />
          );
        }

        return (
          <ModalOverview
            Modal={NotificationModal}
            ModalProps={{
              title: errorInfo.type,
              desc: errorInfo.desc,
              variant: "error",
              onAccept: () => {
                setError(undefined);
              },
            }}
          />
        );
      }}
    </ErrorCatcher>
  );
};

export default ModalErrorCatcher;
