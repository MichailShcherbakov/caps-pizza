import ErrorCatcher, { ErrorCatcherProps } from ".";
import { ModalOverview, NotificationModal } from "~/ui";
import OhNoNotificationModal from "../notifications/modals/oh-no.notification";

export const ModalErrorCatcher: React.FC<
  Pick<ErrorCatcherProps, "error">
> = props => {
  return (
    <ErrorCatcher {...props}>
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
                }}
              />
            );
          }

          return <ModalOverview Modal={OhNoNotificationModal} />;
        }

        return (
          <ModalOverview
            Modal={NotificationModal}
            ModalProps={{
              title: errorInfo.type,
              desc: errorInfo.desc,
              variant: "error",
            }}
          />
        );
      }}
    </ErrorCatcher>
  );
};

export default ModalErrorCatcher;
