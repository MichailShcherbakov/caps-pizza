import React from "react";
import {
  ModalController,
  ModalControllerProps,
  NotificationModal,
  NotificationModalProps,
} from "~/ui";

export interface WarnDeletingNotificationModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<NotificationModalProps, "title" | "desc" | "onAccept"> {}

export const WarnDeletingNotificationModal: React.FC<
  WarnDeletingNotificationModalProps
> = ({ title, desc, onAccept, ...props }) => {
  return (
    <ModalController
      {...props}
      Modal={NotificationModal}
      ModalProps={
        {
          title,
          desc,
          variant: "warning",
          AcceptButtonProps: {
            children: "Продолжить",
          },
          ModalFooterProps: {
            variant: "dialog",
          },
          onAccept,
        } as NotificationModalProps
      }
    />
  );
};

export default WarnDeletingNotificationModal;
