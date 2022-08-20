import React from "react";
import {
  ModalController,
  ModalControllerProps,
  NotificationModal,
  NotificationModalProps,
} from "~/ui";

export interface WarnDeletingNotificationModalProps
  extends Pick<
      ModalControllerProps<WarnDeletingNotificationModalProps>,
      "children"
    >,
    Pick<NotificationModalProps, "title" | "desc" | "onAccept" | "onClose"> {}

export const WarnDeletingNotificationModal: React.FC<
  WarnDeletingNotificationModalProps
> = ({ title, desc, onAccept, onClose, ...props }) => {
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
          onClose,
        } as NotificationModalProps
      }
    />
  );
};

export default WarnDeletingNotificationModal;
