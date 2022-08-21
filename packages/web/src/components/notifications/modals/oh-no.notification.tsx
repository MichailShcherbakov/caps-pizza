import React from "react";
import { ModalOverview, NotificationModal, NotificationModalProps } from "~/ui";

export interface OhNoNotificationModalProps
  extends Pick<NotificationModalProps, "onAccept"> {}

export const OhNoNotificationModal: React.FC<OhNoNotificationModalProps> = ({
  onAccept,
}) => {
  return (
    <ModalOverview
      Modal={NotificationModal}
      ModalProps={
        {
          title: "О нет...",
          desc: "Что-то пошло не так. Запомните, какие последние действия вы выполняли, и скорее обратитесь к тех. поддержке.",
          variant: "error",
          onAccept: onAccept,
        } as NotificationModalProps
      }
    />
  );
};

export default OhNoNotificationModal;
