import React from "react";
import { ModalOverview, NotificationModal, NotificationModalProps } from "~/ui";

export interface OhNoTryAgainNotificationModalProps {
  onAccept?: () => void;
}

export const OhNoTryAgainNotificationModal: React.FC<
  OhNoTryAgainNotificationModalProps
> = ({ onAccept }) => {
  return (
    <ModalOverview
      Modal={NotificationModal}
      ModalProps={
        {
          title: "О нет...",
          desc: "Что-то пошло не так. Давайте попробуем еще раз.",
          variant: "error",
          AcceptButtonProps: {
            children: "Попробовать еще раз",
            onClick: onAccept,
          },
        } as NotificationModalProps
      }
    />
  );
};

export default OhNoTryAgainNotificationModal;
