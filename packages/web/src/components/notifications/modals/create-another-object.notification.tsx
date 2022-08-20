import React from "react";
import {
  ModalController,
  ModalControllerHandle,
  NotificationModal,
  NotificationModalProps,
} from "~/ui";

export interface CreateAnotherObjectModalProps
  extends Pick<
    NotificationModalProps,
    "title" | "desc" | "onAccept" | "onClose"
  > {
  children: ModalControllerHandle;
}

export const CreateAnotherObjectModal: React.FC<
  CreateAnotherObjectModalProps
> = ({ title, desc, onAccept, onClose, ...props }) => {
  return (
    <ModalController
      {...props}
      Modal={NotificationModal}
      ModalProps={
        {
          title,
          desc,
          variant: "info",
          AcceptButtonProps: {
            children: "Перейти",
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

export default CreateAnotherObjectModal;
