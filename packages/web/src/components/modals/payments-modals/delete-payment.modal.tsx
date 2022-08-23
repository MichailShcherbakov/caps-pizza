import React from "react";
import WarnDeletingNotificationModal, {
  WarnDeletingNotificationModalProps,
} from "~/components/notifications/modals/warn-deleting.notification";
import { Payment, useDeletePaymentMutation } from "~/services/payments.service";

export interface DeletePaymentModalProps
  extends Pick<
    WarnDeletingNotificationModalProps,
    "children" | "onAccept" | "onClose"
  > {
  payment: Payment;
}

export const DeletePaymentModal: React.FC<DeletePaymentModalProps> = ({
  children,
  payment,
  onAccept,
  onClose,
}) => {
  const [deletePayment] = useDeletePaymentMutation();

  return (
    <WarnDeletingNotificationModal
      title="Удаление варианта оплаты необратимо"
      desc="Вы точно хотите удалить вариант оплаты"
      onAccept={async () => {
        await deletePayment({ uuid: payment.uuid }).unwrap();

        onAccept && onAccept();
      }}
      onClose={onClose}
    >
      {children}
    </WarnDeletingNotificationModal>
  );
};

export default DeletePaymentModal;
