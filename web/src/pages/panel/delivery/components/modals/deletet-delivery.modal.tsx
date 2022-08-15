import React from "react";
import WarnDeletingNotificationModal, {
  WarnDeletingNotificationModalProps,
} from "~/common/components/notifications/modals/warn-deleting.notification";
import {
  Delivery,
  useDeleteDeliveryMutation,
} from "~/services/delivery.service";

export interface DeleteDeliveryModalProps
  extends Pick<
    WarnDeletingNotificationModalProps,
    "onAccept" | "onClose" | "children"
  > {
  delivery: Delivery;
}

export const DeleteDeliveryModal: React.FC<DeleteDeliveryModalProps> = ({
  delivery,
  children,
  onAccept,
  onClose,
}) => {
  const [deleteDelivery] = useDeleteDeliveryMutation();

  return (
    <WarnDeletingNotificationModal
      title="Удаление доставки необратимо"
      desc="Вы точно хотите удалить доставку"
      onAccept={async () => {
        await deleteDelivery({ uuid: delivery.uuid });
        onAccept && onAccept();
      }}
      onClose={onClose}
    >
      {children}
    </WarnDeletingNotificationModal>
  );
};

export default DeleteDeliveryModal;
